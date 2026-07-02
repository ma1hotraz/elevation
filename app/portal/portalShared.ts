import { cn } from "@/lib/utils";

export const portalShell =
  "min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,143,120,0.08),transparent_28%),linear-gradient(180deg,#f8fbfa_0%,#f4faf8_100%)] text-[var(--ink)]";

export const adminShell =
  "grid min-h-screen grid-cols-[300px_minmax(0,1fr)] max-[1100px]:grid-cols-1";

export const adminSidebar =
  "sticky top-0 flex h-screen flex-col justify-between overflow-y-auto border-r border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,var(--deep)_0%,var(--deeper)_100%)] px-5 py-5 text-white shadow-[16px_0_42px_rgba(4,39,36,0.14)] max-[1100px]:h-auto max-[1100px]:justify-start max-[1100px]:border-r-0 max-[1100px]:border-b";

export const adminMain =
  "min-w-0 px-6 py-6 sm:px-8 lg:px-10 xl:px-12";

export const portalEyebrow =
  "text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#0d7b68]";

export const portalTitle =
  "text-[clamp(2.5rem,4vw,3.8rem)] leading-[0.98] tracking-[-0.06em] text-[#123036]";

export const portalLead =
  "max-w-2xl text-[1.02rem] leading-[1.7] text-[#627579]";

export const portalSurface =
  "rounded-[28px] border border-[rgba(8,47,43,0.08)] bg-white shadow-[0_24px_70px_rgba(9,72,69,0.08)]";

export const portalSoftSurface =
  "rounded-[24px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(180deg,#ffffff,#fbfefd)] shadow-[0_18px_50px_rgba(9,72,69,0.06)]";

export const portalSidebarItemBase =
  "flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-left text-[0.95rem] font-semibold transition";

export function portalSidebarItem(active = false) {
  return cn(
    portalSidebarItemBase,
    active
      ? "bg-[rgba(255,255,255,0.08)] text-white shadow-[inset_3px_0_0_#74edc6] ring-1 ring-inset ring-[rgba(116,237,198,0.1)]"
      : "text-white/82 hover:bg-white/[0.06] hover:text-white",
  );
}

export const portalMetricCard =
  "relative overflow-hidden rounded-[24px] border border-[rgba(8,47,43,0.08)] bg-white p-6 shadow-[0_18px_50px_rgba(9,72,69,0.06)]";

export const portalMetricIcon =
  "grid h-14 w-14 place-items-center rounded-[20px] bg-[linear-gradient(180deg,rgba(8,184,146,0.16),rgba(8,115,101,0.08))] text-[#0a7a68]";

export const portalCourseCard =
  "group relative overflow-hidden rounded-[24px] border border-[rgba(8,47,43,0.08)] bg-white p-5 shadow-[0_18px_50px_rgba(9,72,69,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(9,72,69,0.08)]";

export const portalKicker =
  "text-[0.7rem] font-black uppercase tracking-[0.16em] text-[#0d7b68]";

export const portalSidebarNote =
  "rounded-[18px] border border-white/10 bg-white/[0.08] p-4 backdrop-blur-sm";

export const portalStyles = {
  page:
    "min-h-screen bg-[linear-gradient(135deg,rgba(5,61,58,0.96),rgba(4,39,36,0.98))_0_0/100%_320px_no-repeat,#f5fbfb] p-7 text-[var(--ink)] max-[640px]:bg-[linear-gradient(135deg,rgba(5,61,58,0.96),rgba(4,39,36,0.98))_0_0/100%_390px_no-repeat,#f5fbfb] max-[640px]:p-[18px]",
  loginPage:
    "flex min-h-screen flex-col bg-[linear-gradient(135deg,rgba(5,61,58,0.98),rgba(4,39,36,0.99))]",
  loginTopbar:
    "mx-auto mb-7 flex w-full max-w-[1120px] items-center justify-between gap-[18px] max-[980px]:mb-1.5 max-[640px]:flex-wrap max-[640px]:items-start",
  logoRow: "inline-flex items-center text-inherit",
  loginLogo: "block w-[clamp(126px,11vw,168px)] object-contain",
  logoImage: "block w-[clamp(150px,13vw,202px)] object-contain",
  loginBackLink:
    "inline-flex w-fit items-center gap-[9px] font-[850] text-white/85 transition hover:text-white [&_svg]:h-[18px] [&_svg]:w-[18px]",
  loginShell:
    "mx-auto grid w-full max-w-[1120px] flex-1 grid-cols-[minmax(0,1.05fr)_minmax(340px,0.75fr)] content-center items-center gap-7 max-[980px]:grid-cols-1 max-[980px]:items-start",
  loginIntro: "text-white",
  loginIntroTitle:
    "mt-7 mb-4 max-w-[720px] text-[3.2rem] leading-[1.02] tracking-normal max-[980px]:text-[2.35rem]",
  loginHeadingAccent: "text-[#74edc6]",
  loginIntroText: "m-0 max-w-[620px] text-[1.02rem] leading-[1.75] text-white/80",
  demoBox:
    "mt-[26px] grid w-full max-w-[540px] gap-[7px] rounded-xl border border-white/10 bg-white/[0.08] p-4 [&_span]:text-[0.92rem] [&_span]:text-white/85 [&_strong]:text-[#8ef1ce]",
  loginCard:
    "ml-auto w-full max-w-[420px] overflow-hidden rounded-xl border-[rgba(8,47,43,0.08)] bg-white p-0 text-[#10252b] shadow-[0_24px_70px_rgba(9,72,69,0.08)] max-[640px]:p-[18px] [&_[data-slot=card-content]]:px-[22px] [&_[data-slot=card-content]]:pt-[18px] [&_[data-slot=card-content]]:pb-[22px] [&_[data-slot=card-header]]:px-[22px] [&_[data-slot=card-header]]:pt-[22px] [&_[data-slot=card-header]]:pb-0 [&_form]:grid [&_form]:gap-0.5 [&_h2]:mb-[18px] [&_h2]:text-[1.35rem] [&_h2]:tracking-normal",
  formField:
    "mb-3.5 grid gap-[7px] [&_label]:text-[0.84rem] [&_label]:font-[850] [&_label]:text-[#45595e]",
  error: "mb-3 mt-0 font-extrabold text-[#b42318]",
  fullWidthButton: "w-full [&+&]:mt-2.5",
  formGrid: "grid grid-cols-2 gap-3 max-[640px]:grid-cols-1",
  selectTrigger: "min-h-11 w-full justify-between",
  portalTopbar:
    "mx-auto mb-7 flex w-full max-w-[1240px] items-center justify-between gap-[18px] text-white max-[640px]:flex-col max-[640px]:items-start",
  userControls: "flex items-center gap-3 max-[640px]:flex-col max-[640px]:items-start [&_span]:font-extrabold [&_span]:text-white/85",
  dashboardHero:
    "mx-auto mb-[22px] grid w-full max-w-[1240px] grid-cols-[minmax(0,1fr)_minmax(360px,0.65fr)] items-end gap-[22px] text-white max-[980px]:grid-cols-1 [&_h1]:m-0 [&_h1]:max-w-[760px] [&_h1]:text-[2.55rem] [&_h1]:leading-[1.08] [&_h1]:tracking-normal max-[640px]:[&_h1]:text-[2rem] [&_p]:mb-[9px] [&_p]:mt-0 [&_p]:text-[0.78rem] [&_p]:font-black [&_p]:uppercase [&_p]:tracking-[0.16em] [&_p]:text-[#8ef1ce]",
  statsGrid:
    "grid grid-cols-3 gap-2.5 max-[640px]:grid-cols-1 [&_span]:min-h-[84px] [&_span]:rounded-xl [&_span]:border [&_span]:border-white/10 [&_span]:bg-white/[0.08] [&_span]:p-3.5 [&_span]:text-[0.78rem] [&_span]:font-[850] [&_span]:text-white/75 [&_strong]:mb-[5px] [&_strong]:block [&_strong]:text-[1.8rem] [&_strong]:text-white",
  courseFilter:
    "mx-auto mb-[22px] flex w-full max-w-[1240px] flex-wrap gap-2.5 [&_[data-slot=button]]:min-h-[42px] [&_[data-slot=button]]:rounded-full [&_[data-slot=button]]:border-white/10 [&_[data-slot=button]]:bg-white/[0.08] [&_[data-slot=button]]:px-4 [&_[data-slot=button]]:py-2.5 [&_[data-slot=button]]:font-black [&_[data-slot=button]]:text-white/85",
  activeFilter: "!bg-white !text-[#063a37]",
  resourceGrid: "mx-auto grid w-full max-w-[1240px] grid-cols-3 gap-[18px] max-[980px]:grid-cols-1",
  resourceColumn: "grid content-start gap-3",
  columnHeader:
    "flex items-center justify-between gap-3 px-0.5 [&_h2]:m-0 [&_h2]:text-[1.1rem] [&_h2]:text-[#143034] [&_span]:grid [&_span]:min-h-[30px] [&_span]:min-w-[30px] [&_span]:place-items-center [&_span]:rounded-full [&_span]:bg-[#e9fbf5] [&_span]:font-black [&_span]:text-[#087365]",
  resourceCard:
    "rounded-xl border border-[rgba(8,47,43,0.08)] bg-white p-[18px] text-[#10252b] shadow-[0_18px_48px_rgba(9,72,69,0.05)] [&_h3]:mb-2 [&_h3]:mt-0 [&_h3]:text-[1.08rem] [&_h3]:leading-[1.25] [&_h3]:text-[#123036] [&_p]:mb-4 [&_p]:mt-0 [&_p]:text-[0.92rem] [&_p]:leading-[1.58] [&_p]:text-[#627579]",
  resourceMeta:
    "mb-3 flex flex-wrap gap-2 [&_span]:inline-flex [&_span]:min-h-7 [&_span]:items-center [&_span]:rounded-full [&_span]:bg-[#e9fbf5] [&_span]:px-[9px] [&_span]:py-[5px] [&_span]:text-[0.72rem] [&_span]:font-black [&_span]:text-[#087365]",
  resourceActions:
    "flex flex-wrap gap-2.5 [&_a]:inline-flex [&_a]:min-h-10 [&_a]:items-center [&_a]:justify-center [&_a]:gap-2 [&_a]:rounded-[9px] [&_a]:bg-[#075f58] [&_a]:px-3.5 [&_a]:py-[9px] [&_a]:font-black [&_a]:text-white [&_svg]:h-[17px] [&_svg]:w-[17px]",
  emptyState:
    "m-0 rounded-xl border border-dashed border-[rgba(8,47,43,0.18)] bg-white/60 p-[18px] font-bold text-[#708084]",
  adminGrid: "grid min-h-screen grid-cols-[260px_minmax(0,1fr)] bg-[var(--soft)] max-[1100px]:grid-cols-1",
  adminSidebar:
    "sticky top-0 flex h-screen min-h-screen flex-col justify-between gap-[22px] overflow-y-auto bg-[radial-gradient(circle_at_74%_8%,rgba(109,235,201,0.13),transparent_124px),linear-gradient(180deg,#073f3a_0%,#043a35_45%,#042f2b_100%)] px-3.5 pb-4 pt-[21px] text-white shadow-[16px_0_42px_rgba(4,39,36,0.16)] max-[1100px]:static max-[1100px]:h-auto max-[1100px]:min-h-0 max-[1100px]:justify-start max-[1100px]:border-b max-[1100px]:border-white/10",
  sidebarTop: "grid gap-5",
  sidebarBrand: "ml-0.5 inline-flex w-fit items-center",
  sidebarLogo: "block w-[172px] object-contain",
  sidebarNavGroup: "grid gap-3",
  sidebarKicker:
    "ml-1.5 text-[0.72rem] tracking-[0.18em] text-[#8ef1ce]",
  sidebarNav: "grid gap-[7px]",
  sidebarItemBase:
    "min-h-[41px] w-full justify-start gap-[11px] rounded-lg border-0 bg-transparent px-3 py-[9px] text-left text-[0.86rem] font-[850] leading-none text-white/90 shadow-none hover:bg-white/[0.095] hover:text-white",
  sidebarItemActive:
    "bg-white/[0.095] text-white shadow-[inset_3px_0_0_#74edc6,inset_0_0_0_1px_rgba(255,255,255,0.03)]",
  sidebarLatestCard:
    "mt-px grid gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.075] p-[14px_13px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] [&_span]:text-[0.76rem] [&_span]:font-semibold [&_span]:text-white/65 [&_strong]:text-[0.9rem] [&_strong]:font-bold [&_strong]:leading-[1.35] [&_strong]:text-white",
  sidebarFooter: "grid gap-2.5 pt-[18px]",
  sidebarAccount:
    "grid grid-cols-[38px_minmax(0,1fr)] items-center gap-2.5 rounded-[10px] border border-white/10 bg-white/[0.075] p-[11px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
  sidebarAvatar:
    "grid h-[38px] w-[38px] place-items-center rounded-[9px] bg-[linear-gradient(180deg,rgba(142,241,206,0.2),rgba(255,255,255,0.08))] text-[0.74rem] font-black tracking-[0.04em] text-[#dffdf3] shadow-[inset_0_0_0_1px_rgba(142,241,206,0.22)]",
  sidebarUserMeta:
    "min-w-0 [&_p]:mb-[3px] [&_p]:mt-0 [&_p]:truncate [&_p]:text-[0.62rem] [&_p]:font-black [&_p]:uppercase [&_p]:tracking-[0.14em] [&_p]:text-[#8ef1ce] [&_span]:mt-[3px] [&_span]:block [&_span]:truncate [&_span]:text-[0.7rem] [&_span]:font-bold [&_span]:text-white/65 [&_strong]:block [&_strong]:truncate [&_strong]:text-[0.84rem] [&_strong]:font-black [&_strong]:leading-[1.2] [&_strong]:text-white",
  sidebarRoleBadge:
    "col-span-full inline-flex min-h-[22px] w-fit items-center rounded-full bg-[#8ef1ce]/10 px-2 py-1 text-[0.65rem] font-black uppercase leading-none text-[#8ef1ce]",
  sidebarSignOutButton:
    "min-h-10 justify-center gap-2 rounded-[9px] border border-white/10 bg-white/[0.07] text-[0.82rem] font-black text-white/90 shadow-none hover:bg-white/[0.12] hover:text-white",
  panel:
    "rounded-2xl border border-[rgba(8,47,43,0.08)] bg-white p-[18px] shadow-[0_20px_58px_rgba(9,72,69,0.06)]",
  formCard:
    "rounded-[14px] border border-[rgba(8,47,43,0.08)] bg-white p-0 text-[#10252b] shadow-[0_16px_42px_rgba(9,72,69,0.06)] max-[640px]:p-[18px]",
  panelHeader:
    "mb-4 flex items-start justify-between gap-4 max-[640px]:flex-col [&_h2]:m-0 [&_h2]:text-[1.28rem] [&_h2]:tracking-normal [&_h2]:text-[#10252b] [&_p]:mb-2 [&_p]:mt-0 [&_p]:text-[0.74rem] [&_p]:font-black [&_p]:uppercase [&_p]:tracking-[0.14em] [&_p]:text-[#087365]",
  panelHeaderActions:
    "flex flex-wrap justify-end gap-2.5 max-[640px]:w-full max-[640px]:flex-col max-[640px]:items-stretch",
  libraryToolbar:
    "mb-4 grid grid-cols-[minmax(280px,1fr)_minmax(160px,220px)_minmax(180px,240px)] items-end gap-3 rounded-[10px] border border-[rgba(8,47,43,0.08)] bg-[#fbfefd] p-3 max-[980px]:grid-cols-1",
  filterField: "mb-0 gap-2",
  searchField: "min-w-0",
  searchControl: "relative [&_svg]:pointer-events-none [&_svg]:absolute [&_svg]:left-3 [&_svg]:top-1/2 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:-translate-y-1/2 [&_svg]:text-[#708084] [&_input]:pl-[38px]",
  filterControl: "h-[46px] min-h-[46px] rounded-[10px]",
  tableFrame:
    "overflow-hidden rounded-[14px] border border-[rgba(8,47,43,0.08)] bg-white",
  resourceTable: "min-w-[940px]",
  resourceTitleCell:
    "grid min-w-0 gap-[5px] [&_small]:max-w-[540px] [&_small]:overflow-hidden [&_small]:truncate [&_small]:text-[0.76rem] [&_small]:font-extrabold [&_small]:text-[#087365] [&_span]:text-[0.84rem] [&_span]:leading-[1.45] [&_span]:text-[#627579] [&_strong]:text-[0.94rem] [&_strong]:leading-[1.3] [&_strong]:text-[#10252b]",
  tableActions: "flex flex-wrap gap-2",
  coursePills:
    "flex flex-wrap gap-1.5 [&_span]:rounded-full [&_span]:bg-[#e9fbf5] [&_span]:px-2 [&_span]:py-[5px] [&_span]:text-[0.72rem] [&_span]:font-black [&_span]:text-[#087365]",
  studentList:
    "grid gap-3 rounded-[14px] border border-[rgba(8,47,43,0.08)] bg-white p-5 text-[#10252b] shadow-[0_16px_42px_rgba(9,72,69,0.06)] max-[640px]:p-[18px]",
  tableToolbar:
    "mb-3.5 flex items-center justify-between gap-3 rounded-[10px] border border-[rgba(8,47,43,0.08)] bg-[#fbfefd] px-3 py-2.5 max-[640px]:w-full max-[640px]:flex-col max-[640px]:items-stretch [&_span]:text-[0.86rem] [&_span]:font-[850] [&_span]:text-[#627579]",
  selectedRow: "[&_td]:bg-[#f0fbf7]",
  dialogContent: "max-w-[620px] [&_form]:grid [&_form]:gap-0.5",
  checkboxGroup:
    "mb-[18px] mt-1 flex flex-wrap gap-x-3.5 gap-y-2.5 [&_strong]:w-full [&_strong]:text-[0.84rem] [&_strong]:text-[#45595e] [&_label]:m-0 [&_label]:inline-flex [&_label]:items-center [&_label]:gap-2",
  editActions:
    "flex flex-wrap gap-2.5 max-[640px]:w-full max-[640px]:flex-col max-[640px]:items-stretch",
};
