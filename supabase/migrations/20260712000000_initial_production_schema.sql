-- Elevation Institute production schema
-- Run this migration in the Supabase SQL editor or with `supabase db push`.

create extension if not exists citext with schema extensions;
create extension if not exists pgcrypto with schema extensions;

do $$ begin
  create type public.user_role as enum ('admin', 'teacher', 'student');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.account_status as enum ('active', 'suspended');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.course_code as enum ('PCM', 'IELTS', 'French');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.resource_type as enum ('Live Test', 'Previous Test', 'Revision Material', 'Study Material');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.resource_status as enum ('Upcoming', 'Live', 'Archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.answer_release_status as enum ('Hidden', 'Published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_method as enum ('UPI', 'Card', 'Cash', 'Bank Transfer', 'Other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('Paid', 'Pending', 'Refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.enquiry_status as enum ('new', 'contacted', 'qualified', 'closed');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) between 2 and 100),
  email extensions.citext not null unique,
  role public.user_role not null default 'student',
  account_status public.account_status not null default 'active',
  phone text not null default '' check (char_length(phone) <= 30),
  guardian_name text not null default '' check (char_length(guardian_name) <= 100),
  address text not null default '' check (char_length(address) <= 300),
  must_change_password boolean not null default false,
  joined_on date not null default current_date,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_courses (
  user_id uuid not null references public.profiles(id) on delete cascade,
  course public.course_code not null,
  created_at timestamptz not null default now(),
  primary key (user_id, course)
);

create table if not exists public.resources (
  id uuid primary key default extensions.gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 2 and 160),
  course public.course_code not null,
  category public.resource_type not null,
  status public.resource_status not null default 'Live',
  url text not null check (char_length(trim(url)) between 8 and 2000 and trim(url) ~* '^https?://'),
  answer_url text check (answer_url is null or (char_length(trim(answer_url)) between 8 and 2000 and trim(answer_url) ~* '^https?://')),
  answer_release_status public.answer_release_status not null default 'Hidden',
  description text not null default '' check (char_length(description) <= 1000),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint answer_publish_requires_url check (answer_release_status = 'Hidden' or answer_url is not null)
);

create table if not exists public.student_performance (
  student_id uuid primary key references public.profiles(id) on delete cascade,
  attendance smallint not null default 0 check (attendance between 0 and 100),
  completion smallint not null default 0 check (completion between 0 and 100),
  rank integer not null default 0 check (rank >= 0),
  last_assessment text not null default 'No assessments yet' check (char_length(last_assessment) <= 160),
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.student_scores (
  id uuid primary key default extensions.gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course public.course_code not null,
  test_name text not null check (char_length(trim(test_name)) between 2 and 160),
  score numeric(5,2) not null check (score between 0 and 100),
  assessment_date date not null default current_date,
  notes text not null default '' check (char_length(notes) <= 500),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create sequence if not exists public.invoice_number_seq start 1;

create or replace function public.next_invoice_number()
returns text
language plpgsql
volatile
security definer
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') <> 'service_role'
     and not exists (
       select 1 from public.profiles
       where id = auth.uid() and role = 'admin' and account_status = 'active'
     ) then
    raise exception 'Administrator access is required';
  end if;

  return 'INV-' || to_char(current_date, 'YYYY') || '-' || lpad(nextval('public.invoice_number_seq')::text, 6, '0');
end;
$$;

create table if not exists public.payments (
  id uuid primary key default extensions.gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  label text not null check (char_length(trim(label)) between 2 and 120),
  amount numeric(12,2) not null check (amount > 0 and amount <= 10000000),
  payment_date date not null,
  method public.payment_method not null,
  invoice_number text not null unique default public.next_invoice_number(),
  status public.payment_status not null default 'Pending',
  notes text not null default '' check (char_length(notes) <= 500),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default extensions.gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 100),
  contact text not null check (char_length(trim(contact)) between 5 and 160),
  course text not null check (char_length(trim(course)) between 2 and 100),
  preferred_time text not null check (preferred_time in ('Morning', 'Afternoon', 'Evening')),
  message text not null default '' check (char_length(message) <= 1500),
  status public.enquiry_status not null default 'new',
  source text not null default 'website' check (char_length(source) <= 80),
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null check (char_length(action) between 2 and 120),
  entity_type text not null check (char_length(entity_type) between 2 and 80),
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.request_rate_limits (
  rate_key text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 1 check (request_count > 0),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_status_idx on public.profiles(role, account_status);
create index if not exists user_courses_course_idx on public.user_courses(course, user_id);
create index if not exists resources_course_status_idx on public.resources(course, status, created_at desc);
create index if not exists student_scores_student_date_idx on public.student_scores(student_id, assessment_date desc);
create index if not exists payments_student_date_idx on public.payments(student_id, payment_date desc);
create index if not exists payments_status_date_idx on public.payments(status, payment_date);
create index if not exists enquiries_status_created_idx on public.enquiries(status, created_at desc);
create index if not exists audit_logs_actor_created_idx on public.audit_logs(actor_id, created_at desc);
create index if not exists request_rate_limits_updated_idx on public.request_rate_limits(updated_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists resources_set_updated_at on public.resources;
create trigger resources_set_updated_at before update on public.resources
for each row execute function public.set_updated_at();

drop trigger if exists student_scores_set_updated_at on public.student_scores;
create trigger student_scores_set_updated_at before update on public.student_scores
for each row execute function public.set_updated_at();

drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at before update on public.payments
for each row execute function public.set_updated_at();

drop trigger if exists enquiries_set_updated_at on public.enquiries;
create trigger enquiries_set_updated_at before update on public.enquiries
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  insert into public.profiles (id, full_name, email, role, account_status, must_change_password)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(coalesce(new.email, 'New User'), '@', 1)),
    coalesce(new.email, new.id::text || '@pending.local'),
    'student',
    'active',
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_active_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and account_status = 'active'
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_active_user() and public.current_user_role() = 'admin';
$$;

create or replace function public.has_course_access(target_course public.course_code)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_active_user() and (
    public.current_user_role() = 'admin'
    or exists (
      select 1 from public.user_courses
      where user_id = auth.uid() and course = target_course
    )
  );
$$;

create or replace function public.can_access_student(target_student uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_active_user() and (
    auth.uid() = target_student
    or public.current_user_role() = 'admin'
    or (
      public.current_user_role() = 'teacher'
      and exists (
        select 1
        from public.user_courses teacher_courses
        join public.user_courses student_courses on student_courses.course = teacher_courses.course
        join public.profiles target_profile on target_profile.id = student_courses.user_id
        where teacher_courses.user_id = auth.uid()
          and student_courses.user_id = target_student
          and target_profile.role = 'student'
      )
    )
  );
$$;

create or replace function public.can_manage_student(target_student uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_active_user() and (
    public.current_user_role() = 'admin'
    or (
      public.current_user_role() = 'teacher'
      and public.can_access_student(target_student)
    )
  );
$$;

create or replace function public.update_my_profile(
  p_phone text,
  p_guardian_name text,
  p_address text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not public.is_active_user() then
    raise exception 'Not authorized';
  end if;

  if char_length(coalesce(p_phone, '')) > 30
     or char_length(coalesce(p_guardian_name, '')) > 100
     or char_length(coalesce(p_address, '')) > 300 then
    raise exception 'Profile field is too long';
  end if;

  update public.profiles
  set phone = trim(coalesce(p_phone, '')),
      guardian_name = case when role = 'student' then trim(coalesce(p_guardian_name, '')) else '' end,
      address = trim(coalesce(p_address, ''))
  where id = auth.uid();
end;
$$;

create or replace function public.mark_password_changed()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authorized';
  end if;

  update public.profiles
  set must_change_password = false
  where id = auth.uid();
end;
$$;

create or replace function public.touch_last_seen()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null then
    update public.profiles
    set last_seen_at = now()
    where id = auth.uid()
      and (last_seen_at is null or last_seen_at < now() - interval '10 minutes');
  end if;
end;
$$;

create or replace function public.consume_request_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns table(allowed boolean, retry_after integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
  v_started timestamptz;
  v_now timestamptz := now();
begin
  if char_length(p_key) < 16 or p_limit < 1 or p_window_seconds < 1 then
    raise exception 'Invalid rate limit parameters';
  end if;

  insert into public.request_rate_limits (rate_key, window_started_at, request_count, updated_at)
  values (p_key, v_now, 1, v_now)
  on conflict (rate_key) do update
  set window_started_at = case
        when request_rate_limits.window_started_at <= v_now - make_interval(secs => p_window_seconds)
          then v_now
        else request_rate_limits.window_started_at
      end,
      request_count = case
        when request_rate_limits.window_started_at <= v_now - make_interval(secs => p_window_seconds)
          then 1
        else request_rate_limits.request_count + 1
      end,
      updated_at = v_now
  returning request_count, window_started_at into v_count, v_started;

  if random() < 0.01 then
    delete from public.request_rate_limits
    where updated_at < v_now - interval '2 days';
  end if;

  return query
  select
    v_count <= p_limit,
    greatest(
      0,
      ceil(extract(epoch from (v_started + make_interval(secs => p_window_seconds) - v_now)))::integer
    );
end;
$$;


create or replace function public.service_save_managed_account(
  p_user_id uuid,
  p_full_name text,
  p_email text,
  p_role public.user_role,
  p_account_status public.account_status,
  p_phone text,
  p_guardian_name text,
  p_address text,
  p_courses public.course_code[],
  p_actor_id uuid,
  p_action text
)
returns public.user_role
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_role public.user_role;
  v_courses public.course_code[] := coalesce(p_courses, array[]::public.course_code[]);
begin
  select role into v_role
  from public.profiles
  where id = p_user_id
  for update;

  if not found then
    raise exception 'Managed account profile does not exist';
  end if;

  if v_role = 'admin' or p_role = 'admin' then
    raise exception 'Admin accounts cannot be changed through this operation';
  end if;

  if char_length(trim(coalesce(p_full_name, ''))) not between 2 and 100
     or char_length(trim(coalesce(p_email, ''))) < 3
     or char_length(coalesce(p_phone, '')) > 30
     or char_length(coalesce(p_guardian_name, '')) > 100
     or char_length(coalesce(p_address, '')) > 300 then
    raise exception 'Managed account data is invalid';
  end if;

  if p_account_status = 'active' and cardinality(v_courses) = 0 then
    raise exception 'Active accounts require at least one course';
  end if;

  update public.profiles
  set full_name = trim(p_full_name),
      email = lower(trim(p_email))::extensions.citext,
      role = p_role,
      account_status = p_account_status,
      phone = trim(coalesce(p_phone, '')),
      guardian_name = case when p_role = 'student' then trim(coalesce(p_guardian_name, '')) else '' end,
      address = trim(coalesce(p_address, '')),
      must_change_password = case
        when p_action = 'account.created' then true
        else must_change_password
      end
  where id = p_user_id;

  delete from public.user_courses where user_id = p_user_id;

  insert into public.user_courses (user_id, course)
  select p_user_id, course
  from unnest(v_courses) as course
  group by course;

  if p_role = 'student' then
    insert into public.student_performance (student_id, updated_by)
    values (p_user_id, p_actor_id)
    on conflict (student_id) do nothing;
  end if;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values (
    p_actor_id,
    left(coalesce(nullif(trim(p_action), ''), 'account.updated'), 120),
    'profile',
    p_user_id::text,
    jsonb_build_object('role', p_role, 'email', lower(trim(p_email)), 'status', p_account_status)
  );

  return p_role;
end;
$$;

create or replace function public.service_set_account_status(
  p_user_id uuid,
  p_status public.account_status,
  p_actor_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role public.user_role;
  v_email text;
begin
  select role, email::text into v_role, v_email
  from public.profiles
  where id = p_user_id
  for update;

  if not found or v_role = 'admin' then
    raise exception 'This account cannot be changed here';
  end if;

  update public.profiles
  set account_status = p_status
  where id = p_user_id;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values (
    p_actor_id,
    case when p_status = 'suspended' then 'account.suspended' else 'account.reactivated' end,
    'profile',
    p_user_id::text,
    jsonb_build_object('email', v_email)
  );
end;
$$;

create or replace function public.service_mark_password_reset(
  p_user_id uuid,
  p_actor_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role public.user_role;
  v_email text;
begin
  select role, email::text into v_role, v_email
  from public.profiles
  where id = p_user_id
  for update;

  if not found or v_role = 'admin' then
    raise exception 'Only managed accounts can be reset here';
  end if;

  update public.profiles
  set must_change_password = true,
      account_status = 'active'
  where id = p_user_id;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values (p_actor_id, 'account.password_reset', 'profile', p_user_id::text, jsonb_build_object('email', v_email));
end;
$$;

revoke all on function public.handle_new_auth_user() from public, anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.current_user_role() from public, anon;
revoke all on function public.is_active_user() from public, anon;
revoke all on function public.is_admin() from public, anon;
revoke all on function public.has_course_access(public.course_code) from public, anon;
revoke all on function public.can_access_student(uuid) from public, anon;
revoke all on function public.can_manage_student(uuid) from public, anon;
revoke all on function public.update_my_profile(text, text, text) from public, anon;
revoke all on function public.mark_password_changed() from public, anon;
revoke all on function public.touch_last_seen() from public, anon;
revoke all on function public.next_invoice_number() from public, anon;
revoke all on function public.consume_request_rate_limit(text, integer, integer) from public, anon, authenticated;
revoke all on function public.service_save_managed_account(uuid, text, text, public.user_role, public.account_status, text, text, text, public.course_code[], uuid, text) from public, anon, authenticated;
revoke all on function public.service_set_account_status(uuid, public.account_status, uuid) from public, anon, authenticated;
revoke all on function public.service_mark_password_reset(uuid, uuid) from public, anon, authenticated;
grant execute on function public.next_invoice_number() to authenticated, service_role;
grant execute on function public.consume_request_rate_limit(text, integer, integer) to service_role;
grant execute on function public.service_save_managed_account(uuid, text, text, public.user_role, public.account_status, text, text, text, public.course_code[], uuid, text) to service_role;
grant execute on function public.service_set_account_status(uuid, public.account_status, uuid) to service_role;
grant execute on function public.service_mark_password_reset(uuid, uuid) to service_role;

grant execute on function public.current_user_role() to authenticated;
grant execute on function public.is_active_user() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.has_course_access(public.course_code) to authenticated;
grant execute on function public.can_access_student(uuid) to authenticated;
grant execute on function public.can_manage_student(uuid) to authenticated;
grant execute on function public.update_my_profile(text, text, text) to authenticated;
grant execute on function public.mark_password_changed() to authenticated;
grant execute on function public.touch_last_seen() to authenticated;

alter table public.profiles enable row level security;
alter table public.user_courses enable row level security;
alter table public.resources enable row level security;
alter table public.student_performance enable row level security;
alter table public.student_scores enable row level security;
alter table public.payments enable row level security;
alter table public.enquiries enable row level security;
alter table public.audit_logs enable row level security;
alter table public.request_rate_limits enable row level security;

revoke all on public.profiles from anon, authenticated;
revoke all on public.user_courses from anon, authenticated;
revoke all on public.resources from anon, authenticated;
revoke all on public.student_performance from anon, authenticated;
revoke all on public.student_scores from anon, authenticated;
revoke all on public.payments from anon, authenticated;
revoke all on public.enquiries from anon, authenticated;
revoke all on public.audit_logs from anon, authenticated;
revoke all on public.request_rate_limits from public, anon, authenticated;

grant select on public.profiles, public.user_courses, public.resources, public.student_performance, public.student_scores, public.payments to authenticated;
grant insert, update, delete on public.resources, public.student_performance, public.student_scores, public.payments to authenticated;
grant select, update on public.enquiries to authenticated;
grant select on public.audit_logs to authenticated;
grant all on public.profiles, public.user_courses, public.resources, public.student_performance, public.student_scores, public.payments, public.enquiries, public.audit_logs, public.request_rate_limits to service_role;
grant usage, select, update on all sequences in schema public to service_role;

drop policy if exists profiles_select_policy on public.profiles;
create policy profiles_select_policy on public.profiles
for select to authenticated
using (
  public.is_active_user() and (
    id = auth.uid()
    or public.is_admin()
    or (role = 'student' and public.can_access_student(id))
  )
);

drop policy if exists user_courses_select_policy on public.user_courses;
create policy user_courses_select_policy on public.user_courses
for select to authenticated
using (
  public.is_active_user() and (
    user_id = auth.uid()
    or public.is_admin()
    or public.can_access_student(user_id)
  )
);

drop policy if exists resources_select_policy on public.resources;
create policy resources_select_policy on public.resources
for select to authenticated
using (public.has_course_access(course));

drop policy if exists resources_insert_policy on public.resources;
create policy resources_insert_policy on public.resources
for insert to authenticated
with check (
  public.is_active_user()
  and (public.is_admin() or public.current_user_role() = 'teacher')
  and public.has_course_access(course)
  and created_by = auth.uid()
);

drop policy if exists resources_update_policy on public.resources;
create policy resources_update_policy on public.resources
for update to authenticated
using (
  public.is_active_user()
  and (public.is_admin() or public.current_user_role() = 'teacher')
  and public.has_course_access(course)
)
with check (
  public.is_active_user()
  and (public.is_admin() or public.current_user_role() = 'teacher')
  and public.has_course_access(course)
);

drop policy if exists resources_delete_policy on public.resources;
create policy resources_delete_policy on public.resources
for delete to authenticated
using (
  public.is_active_user()
  and (public.is_admin() or public.current_user_role() = 'teacher')
  and public.has_course_access(course)
);

drop policy if exists performance_select_policy on public.student_performance;
create policy performance_select_policy on public.student_performance
for select to authenticated
using (public.can_access_student(student_id));

drop policy if exists performance_insert_policy on public.student_performance;
create policy performance_insert_policy on public.student_performance
for insert to authenticated
with check (public.can_manage_student(student_id) and updated_by = auth.uid());

drop policy if exists performance_update_policy on public.student_performance;
create policy performance_update_policy on public.student_performance
for update to authenticated
using (public.can_manage_student(student_id))
with check (public.can_manage_student(student_id) and updated_by = auth.uid());

drop policy if exists scores_select_policy on public.student_scores;
create policy scores_select_policy on public.student_scores
for select to authenticated
using (public.can_access_student(student_id));

drop policy if exists scores_insert_policy on public.student_scores;
create policy scores_insert_policy on public.student_scores
for insert to authenticated
with check (
  public.can_manage_student(student_id)
  and public.has_course_access(course)
  and created_by = auth.uid()
);

drop policy if exists scores_update_policy on public.student_scores;
create policy scores_update_policy on public.student_scores
for update to authenticated
using (public.can_manage_student(student_id))
with check (
  public.can_manage_student(student_id)
  and public.has_course_access(course)
);

drop policy if exists scores_delete_policy on public.student_scores;
create policy scores_delete_policy on public.student_scores
for delete to authenticated
using (public.can_manage_student(student_id));

drop policy if exists payments_select_policy on public.payments;
create policy payments_select_policy on public.payments
for select to authenticated
using (public.is_admin() or (public.is_active_user() and student_id = auth.uid()));

drop policy if exists payments_insert_policy on public.payments;
create policy payments_insert_policy on public.payments
for insert to authenticated
with check (public.is_admin() and created_by = auth.uid());

drop policy if exists payments_update_policy on public.payments;
create policy payments_update_policy on public.payments
for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists payments_delete_policy on public.payments;
create policy payments_delete_policy on public.payments
for delete to authenticated
using (public.is_admin());

drop policy if exists enquiries_admin_select_policy on public.enquiries;
create policy enquiries_admin_select_policy on public.enquiries
for select to authenticated
using (public.is_admin());

drop policy if exists enquiries_admin_update_policy on public.enquiries;
create policy enquiries_admin_update_policy on public.enquiries
for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists audit_logs_admin_select_policy on public.audit_logs;
create policy audit_logs_admin_select_policy on public.audit_logs
for select to authenticated
using (public.is_admin());

-- Add selected tables to Realtime once. This block is safe to re-run.
do $$
declare
  table_name text;
begin
  foreach table_name in array array['profiles', 'user_courses', 'resources', 'student_performance', 'student_scores', 'payments', 'enquiries']
  loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = table_name
    ) then
      execute format('alter publication supabase_realtime add table public.%I', table_name);
    end if;
  end loop;
end $$;
