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
    "relative isolate flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_32%_8%,rgba(100,255,220,0.12),transparent_24rem),radial-gradient(circle_at_78%_50%,rgba(43,185,158,0.1),transparent_28rem),linear-gradient(135deg,#073f3a_0%,#052f2c_48%,#042825_100%)] px-[clamp(1.4rem,5vw,6rem)] py-[clamp(0.45rem,0.9vw,0.8rem)] text-white before:absolute before:inset-0 before:-z-10 before:bg-[linear-gradient(rgba(116,237,198,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(116,237,198,0.025)_1px,transparent_1px)] before:bg-[size:72px_72px]",
  loginTopbar:
    "relative z-10 mx-auto flex w-full max-w-[1520px] items-center justify-between gap-[14px] max-[640px]:flex-wrap max-[640px]:items-start",
  logoRow: "inline-flex items-center text-inherit",
  loginLogo: "block w-[clamp(126px,11vw,168px)] object-contain",
  logoImage: "block w-[clamp(150px,13vw,202px)] object-contain",
  loginBackLink:
    "inline-flex w-fit items-center gap-[10px] text-[1rem] font-black text-white/88 drop-shadow-[0_2px_8px_rgba(0,0,0,0.28)] transition hover:text-[#8ef1ce] [&_svg]:h-5 [&_svg]:w-5",
  loginShell:
    "relative z-10 mx-auto grid w-full max-w-[1520px] flex-1 grid-cols-[minmax(0,1.05fr)_minmax(380px,0.64fr)] content-center items-center gap-[clamp(1rem,3vw,3.2rem)] py-[clamp(0.25rem,0.65vw,0.6rem)] max-[1050px]:grid-cols-1 max-[1050px]:items-start max-[640px]:py-3",
  loginIntro: "relative max-w-[760px] text-white",
  loginIntroTitle:
    "mb-2 mt-2 max-w-[700px] text-[clamp(2.15rem,3.6vw,3.7rem)] font-black leading-[1.02] tracking-normal text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.34)] max-[640px]:text-[2rem]",
  loginHeadingAccent: "text-[#74edc6]",
  loginIntroText: "m-0 max-w-[610px] text-[clamp(0.96rem,1.05vw,1.08rem)] leading-[1.55] text-white/86",
  loginTrustPill:
    "inline-flex min-h-10 items-center gap-3 rounded-full border border-[#8ef1ce]/20 bg-white/[0.08] px-4 text-[0.9rem] font-black text-[#8ef1ce] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-md [&_svg]:h-[18px] [&_svg]:w-[18px]",
  loginFeatureGrid:
    "mt-[1rem] grid max-w-[680px] grid-cols-4 gap-0 max-[760px]:grid-cols-2 max-[520px]:hidden",
  loginFeatureItem:
    "border-l border-white/10 px-[clamp(1rem,2vw,2rem)] first:border-l-0 max-[520px]:border-l-0 max-[520px]:border-t max-[520px]:py-4 max-[520px]:first:border-t-0",
  loginFeatureIcon:
    "mb-3 grid h-11 w-11 place-items-center rounded-lg border border-[#8ef1ce]/20 bg-white/[0.06] text-[#72edca] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] [&_svg]:h-5 [&_svg]:w-5",
  loginFeatureText:
    "m-0 max-w-[12rem] text-[clamp(0.98rem,1.18vw,1.15rem)] font-black leading-[1.32] text-white",
  loginFooterNote:
    "mt-[clamp(1.6rem,3vw,2.6rem)] inline-flex items-center gap-3 text-[0.95rem] font-semibold text-white/86 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-[#8ef1ce]",
  loginWatermark:
    "pointer-events-none absolute bottom-[-13rem] right-[-8rem] -z-10 h-[50rem] w-[50rem] rounded-full border border-[#8ef1ce]/5 bg-[radial-gradient(circle,rgba(142,241,206,0.08),transparent_58%)] opacity-70",
  demoBox:
    "mt-[26px] grid w-full max-w-[540px] gap-[7px] rounded-xl border border-white/10 bg-white/[0.08] p-4 [&_span]:text-[0.92rem] [&_span]:text-white/85 [&_strong]:text-[#8ef1ce]",
  loginCard:
    "ml-auto w-full max-w-[420px] overflow-hidden rounded-[16px] border border-white/80 bg-white/95 p-0 text-[#10252b] shadow-[0_28px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl max-[1050px]:ml-0 max-[640px]:rounded-2xl [&_[data-slot=card-content]]:px-[1.2rem] [&_[data-slot=card-content]]:pb-[1.2rem] [&_[data-slot=card-content]]:pt-0 [&_[data-slot=card-header]]:items-center [&_[data-slot=card-header]]:px-[1.2rem] [&_[data-slot=card-header]]:pb-3 [&_[data-slot=card-header]]:pt-[1.1rem] [&_form]:grid [&_form]:gap-0.5",
  loginCardIcon:
    "mb-2.5 grid h-11 w-11 place-items-center rounded-lg border border-[#bdeee0] bg-[#e8fbf4] text-[#0d8a74] [&_svg]:h-5 [&_svg]:w-5",
  loginCardTitle:
    "m-0 text-center text-[clamp(1.42rem,1.55vw,1.72rem)] font-black leading-tight tracking-normal text-[#1c3036]",
  loginCardSubtitle:
    "m-0 mt-1 text-center text-[0.9rem] font-medium text-[#50656b]",
  loginInputShell: "relative",
  loginInputIcon:
    "pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#75898e]",
  loginInput:
    "h-11 rounded-[8px] border-[#cddadc] bg-white pl-11 pr-12 text-[0.95rem] shadow-[inset_0_1px_0_rgba(16,37,43,0.02)] placeholder:text-[#8b9ca1] focus-visible:border-[#0d8a74] focus-visible:ring-[#0d8a74]/15",
  loginPasswordToggle:
    "absolute right-2 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md border-0 bg-transparent p-0 text-[#5f7378] shadow-none transition hover:bg-[#eef7f5] hover:text-[#087365] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d8a74]/20 [&_svg]:h-5 [&_svg]:w-5",
  loginFormRow:
    "mb-3 flex items-center justify-between gap-4 text-[0.88rem] max-[420px]:flex-col max-[420px]:items-start",
  loginRemember:
    "inline-flex items-center gap-2 font-semibold text-[#1c3036] [&_input]:h-4 [&_input]:w-4 [&_input]:accent-[#087365]",
  loginForgot: "font-bold text-[#087365] transition hover:text-[#064f49]",
  loginSubmitButton:
    "mt-1 h-12 w-full rounded-[8px] border-[#047365] bg-[linear-gradient(180deg,#0b8d7c_0%,#047365_100%)] text-[1rem] font-black text-white shadow-[0_12px_24px_rgba(4,115,101,0.2)] hover:border-[#035f55] hover:bg-[linear-gradient(180deg,#087c70_0%,#035f55_100%)] hover:text-white",
  loginSecureDivider:
    "my-5 grid grid-cols-[1fr_auto_1fr] items-center gap-5 text-[#7a8e93] before:h-px before:bg-[#d9e5e5] after:h-px after:bg-[#d9e5e5] [&_svg]:h-5 [&_svg]:w-5",
  loginSecureText: "m-0 text-center text-[0.92rem] font-medium text-[#5d7075]",
  loginDemoActions:
    "mt-3 flex items-center justify-between gap-3 rounded-lg border border-[#dce8e6] bg-[#f7fbfa] p-2.5 text-[0.78rem] text-[#556e72] max-[420px]:grid",
  formField:
    "mb-2.5 grid gap-[6px] [&_label]:text-[0.82rem] [&_label]:font-[850] [&_label]:text-[#45595e]",
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
  sidebarFooter: "border-t border-white/10 pt-4",
  sidebarAccount:
    "grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 px-1",

  sidebarAvatar:
    "grid h-10 w-10 place-items-center rounded-full bg-white/[0.08] text-[0.72rem] font-black tracking-[0.04em] text-white/88 ring-1 ring-white/10",
  sidebarUserMeta:
    "min-w-0 [&_span]:mt-0.5 [&_span]:block [&_span]:truncate [&_span]:text-[0.72rem] [&_span]:font-medium [&_span]:text-white/58 [&_strong]:block [&_strong]:truncate [&_strong]:text-[0.84rem] [&_strong]:font-black [&_strong]:leading-[1.15] [&_strong]:text-white",

  sidebarSignOutButton:
    "h-9 w-9 justify-center rounded-[10px] border border-white/10 bg-white/[0.04] p-0 text-white/78 shadow-none transition-colors hover:bg-white/[0.08] hover:text-white [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-white/55 hover:[&_svg]:text-white/82",
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
    "w-full overflow-hidden rounded-[14px] border border-[rgba(8,47,43,0.08)] bg-white",
  resourceTitleCell:
    "grid min-w-0 gap-[5px] [&_small]:max-w-[540px] [&_small]:overflow-hidden [&_small]:truncate [&_small]:text-[0.74rem] [&_small]:font-extrabold [&_small]:text-[#087365] [&_span]:text-[0.82rem] [&_span]:leading-[1.45] [&_span]:text-[#627579] [&_strong]:text-[0.96rem] [&_strong]:font-black [&_strong]:leading-[1.24] [&_strong]:text-[#10252b]",
  resourceAnswerText:
    "text-[0.72rem] font-black uppercase tracking-[0.12em] text-[#0d7b68]",
  resourceTypeChip:
    "inline-flex min-h-[28px] w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.72rem] font-black leading-none",
  resourceTypeLive: "bg-[#f4edff] text-[#7a3fd1]",
  resourceTypePrevious: "bg-[#fff5e8] text-[#c06910]",
  resourceTypeRevision: "bg-[#eaf8f1] text-[#13825f]",
  resourceTypeStudy: "bg-[#eaf3ff] text-[#1f73d4]",
  tableActions: "flex flex-wrap gap-2",
  coursePills:
    "flex flex-wrap gap-1.5 [&_span]:rounded-full [&_span]:bg-[#e9fbf5] [&_span]:px-2 [&_span]:py-[5px] [&_span]:text-[0.72rem] [&_span]:font-black [&_span]:text-[#087365]",
  resourceStatusBadge:
    "inline-flex min-h-[26px] items-center rounded-full px-2.5 py-1 text-[0.7rem] font-black uppercase tracking-[0.11em]",
  resourceStatusUpcoming: "!bg-[#fff6e7] !text-[#b96800]",
  resourceStatusLive: "!bg-[#e7fbf4] !text-[#087365]",
  resourceStatusArchived: "!bg-[#eef2f2] !text-[#5f7378]",
  resourceLibraryShell: "grid gap-5",
  resourceDashboardHeader:
    "grid gap-4 rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-white p-5 shadow-[0_18px_48px_rgba(9,72,69,0.06)]",
  resourceDashboardTop:
    "flex flex-wrap items-start justify-between gap-4 max-[640px]:flex-col",
  resourceDashboardActions: "flex flex-wrap gap-2.5 max-[640px]:w-full",
  resourceStatGrid: "grid gap-3 xl:grid-cols-4 lg:grid-cols-2",
  resourceStatCard:
    "grid gap-3 rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-[linear-gradient(180deg,#ffffff,#f9fcfb)] p-4 shadow-[0_14px_36px_rgba(9,72,69,0.05)]",
  resourceStatTop: "flex items-start justify-between gap-3",
  resourceStatIcon:
    "grid h-11 w-11 place-items-center rounded-[14px] bg-[linear-gradient(180deg,rgba(8,184,146,0.16),rgba(8,115,101,0.06))] text-[#0a7a68]",
  resourceStatValue:
    "block text-[1.8rem] leading-none tracking-[-0.06em] text-[#123036]",
  resourceStatLabel: "text-[0.82rem] font-bold text-[#5f7378]",
  resourceFilterGrid:
    "grid grid-cols-[minmax(0,1.7fr)_minmax(170px,0.65fr)_minmax(170px,0.65fr)] gap-3 rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-[#fbfefd] p-4 max-[1100px]:grid-cols-2 max-[640px]:grid-cols-1",
  resourceFilterField: "mb-0 gap-2",
  resourceFilterControl:
    "h-[46px] min-h-[46px] rounded-[10px] bg-white",
  resourceCountRow:
    "flex flex-wrap items-center justify-between gap-3 px-1.5 text-[0.84rem] font-bold text-[#5f7378]",
  resourceTableWrap: "overflow-hidden rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-white pl-3",
  resourceTable: "min-w-[900px]",
  resourceToolbarButton:
    "h-[46px] rounded-[10px] px-4 text-[0.92rem] font-black",
  paymentPageShell: "grid gap-5 text-[#10252b]",
  paymentHeader:
    "flex flex-wrap items-start justify-between gap-4 rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-white p-5 shadow-[0_18px_48px_rgba(9,72,69,0.06)]",
  paymentKicker:
    "m-0 text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#0d7b68]",
  paymentTitle:
    "m-0 mt-1 text-[1.55rem] font-black leading-tight tracking-normal text-[#10252b]",
  paymentLead:
    "m-0 mt-2 text-[0.94rem] font-semibold text-[#718287]",
  paymentHeaderActions: "flex flex-wrap gap-2.5 max-[640px]:w-full max-[640px]:flex-col",
  paymentStatGrid:
    "grid gap-3 xl:grid-cols-4 lg:grid-cols-2",
  paymentFilterGrid:
    "grid grid-cols-[minmax(0,1.7fr)_minmax(170px,0.7fr)_minmax(170px,0.7fr)] gap-3 rounded-[16px] border border-[rgba(8,47,43,0.08)] bg-white p-4 shadow-[0_12px_34px_rgba(9,72,69,0.04)] max-[1100px]:grid-cols-1",
  paymentCountRow:
    "flex flex-wrap items-center justify-between gap-3 px-1.5 text-[0.84rem] font-bold text-[#5f7378]",
  paymentTableFrame:
    "overflow-hidden rounded-[18px] border border-[rgba(8,47,43,0.08)] bg-white shadow-[0_12px_34px_rgba(9,72,69,0.04)]",
  paymentStatusBadge:
    "inline-flex min-h-[26px] items-center rounded-full px-2.5 py-1 text-[0.72rem] font-black leading-none",
  paymentToolbarButton:
    "h-[46px] rounded-[10px] px-4 text-[0.92rem] font-black",
  studentList:
    "grid gap-3 rounded-[14px] border border-[rgba(8,47,43,0.08)] bg-white p-5 text-[#10252b] shadow-[0_16px_42px_rgba(9,72,69,0.06)] max-[640px]:p-[18px]",
  tableToolbar:
    "w-full gap-4 border-b border-[rgba(8,47,43,0.14)] bg-[#fbfefd] px-5 py-5 [&_span]:text-[0.86rem] [&_span]:font-[850] [&_span]:text-[#627579]",
  selectedRow: "[&_td]:bg-[#f0fbf7]",
  studentPageShell: "grid gap-5 text-[#10252b]",
  studentPageHeader: "flex flex-wrap items-start justify-between gap-4",
  studentPageTitle: "m-0 text-[1.55rem] font-black leading-tight tracking-normal text-[#10252b] [&_span]:text-[#0d7b68]",
  studentPageSubtitle: "m-0 mt-2 text-[0.94rem] font-semibold text-[#718287]",
  studentHeaderActions: "flex flex-wrap items-center justify-end gap-2.5 max-[640px]:w-full max-[640px]:justify-stretch [&_[data-slot=button]]:max-[640px]:flex-1",
  studentStatGrid: "grid gap-3 md:grid-cols-2",
  studentStatCard: "grid grid-cols-[42px_minmax(0,1fr)] items-center gap-3 rounded-[12px] border border-[rgba(8,47,43,0.08)] bg-white px-4 py-4 shadow-[0_12px_34px_rgba(9,72,69,0.04)]",
  studentStatIcon: "grid h-10 w-10 place-items-center rounded-[10px] bg-[#e9fbf5] text-[#087365] [&_svg]:h-5 [&_svg]:w-5",
  studentStatLabel: "block text-[0.8rem] font-bold text-[#7a8b90]",
  studentStatValue: "block text-[1.18rem] font-black leading-tight text-[#10252b]",
  studentFilterGrid: "grid grid-cols-[minmax(0,1fr)_minmax(170px,240px)_minmax(170px,240px)] gap-3 rounded-[14px] border border-[rgba(8,47,43,0.08)] bg-white p-3 shadow-[0_12px_34px_rgba(9,72,69,0.04)] max-[900px]:grid-cols-1",
  studentTableFrame: "overflow-hidden rounded-[14px] border border-[rgba(8,47,43,0.08)] bg-white shadow-[0_12px_34px_rgba(9,72,69,0.04)]",
  studentStatusBadge: "inline-flex min-h-[26px] items-center rounded-full px-2.5 py-1 text-[0.72rem] font-black leading-none",
  studentStatusActive: "bg-[#e9fbf1] text-[#16845f]",
  studentStatusDisabled: "bg-[#fff0f1] text-[#cf4c5a]",
  studentDetailsShell: "grid gap-5 text-[#10252b]",
  studentDetailsHeader: "flex flex-wrap items-start justify-between gap-4",
  studentDetailsTitle: "m-0 text-[1.55rem] font-black leading-tight tracking-normal text-[#10252b]",
  studentDetailsLead: "m-0 mt-2 text-[0.94rem] font-semibold text-[#718287]",
  studentSummaryGrid: "grid gap-3 md:grid-cols-4",
  studentSummaryCard:
    "grid grid-cols-[42px_minmax(0,1fr)] items-center gap-3 rounded-[12px] border border-[rgba(8,47,43,0.08)] bg-white px-4 py-4 shadow-[0_12px_34px_rgba(9,72,69,0.04)]",
  studentSummaryIcon:
    "grid h-10 w-10 place-items-center rounded-[10px] bg-[#e9fbf5] text-[#087365] [&_svg]:h-5 [&_svg]:w-5",
  studentSummaryLabel: "block text-[0.8rem] font-bold text-[#7a8b90]",
  studentSummaryValue: "block truncate text-[1rem] font-black leading-tight text-[#10252b]",
  studentDetailsGrid: "grid gap-3 lg:grid-cols-2",
  studentDetailsCard:
    "grid gap-3 rounded-[14px] border border-[rgba(8,47,43,0.08)] bg-white p-4 shadow-[0_12px_34px_rgba(9,72,69,0.04)]",
  studentDetailsCardLabel: "m-0 text-[0.76rem] font-black uppercase tracking-[0.14em] text-[#0d7b68]",
  studentMetricPill:
    "grid gap-1 rounded-[12px] border border-[rgba(8,47,43,0.08)] bg-[#fbfefd] p-3 [&_span]:text-[0.76rem] [&_span]:font-bold [&_span]:text-[#718287] [&_strong]:text-[1rem] [&_strong]:font-black [&_strong]:text-[#10252b]",
  dialogContent:
    "max-w-[940px] gap-0 overflow-hidden rounded-[18px] border border-[rgba(8,47,43,0.12)] bg-white p-0 text-[#10252b] shadow-[0_30px_96px_rgba(4,39,36,0.28)]",
  dialogHeader:
    "border-b border-[#e5eeec] px-6 py-4 sm:px-7",
  dialogHeaderRow: "gap-1",
  dialogTitle:
    "m-0 text-[1.25rem] font-black leading-tight tracking-normal text-[#10252b]",
  dialogDescription:
    "m-0 max-w-[58ch] text-[0.92rem] font-medium leading-[1.55] text-[#627579]",
  dialogBody:
    "max-h-[calc(100dvh-14rem)] overflow-y-auto px-6 py-5 sm:px-7",
  dialogForm: "grid gap-4",
  dialogSection:
    "grid gap-3 rounded-[12px] border border-[#e1ecea] bg-[#fbfefd] p-4",
  dialogSectionTitle:
    "m-0 text-[0.82rem] font-black uppercase tracking-[0.12em] text-[#45595e]",
  dialogControl:
    "h-12 rounded-[10px] border-[#d6e3e1] bg-white px-4 text-[0.94rem] text-[#10252b] shadow-[inset_0_1px_0_rgba(16,37,43,0.02)] placeholder:text-[#8b9ca1] focus-visible:border-[#0d8a74] focus-visible:ring-[#0d8a74]/15",
  dialogFooter:
    "flex flex-wrap items-center justify-end gap-2.5 border-t border-[#e5eeec] bg-[#fbfefd] px-6 py-4 sm:px-7 max-[640px]:flex-col-reverse max-[640px]:items-stretch",
  courseChoiceGrid: "grid grid-cols-2 gap-2 max-[520px]:grid-cols-1",
  courseChoice:
    "flex min-h-[48px] items-center gap-2.5 rounded-[10px] border border-[#d8e6e3] bg-white px-3.5 py-2.5 text-left text-[0.84rem] font-black text-[#45595e] transition hover:border-[#b9d6d1] hover:bg-[#f7fbfb] has-[[data-state=checked]]:border-[#0d7b68] has-[[data-state=checked]]:bg-[#e8fbf5] has-[[data-state=checked]]:text-[#0a7a68]",
  checkboxGroup:
    "mb-[18px] mt-1 flex flex-wrap gap-x-3.5 gap-y-2.5 [&_strong]:w-full [&_strong]:text-[0.84rem] [&_strong]:text-[#45595e] [&_label]:m-0 [&_label]:inline-flex [&_label]:items-center [&_label]:gap-2",
  editActions:
    "flex flex-wrap gap-2.5 max-[640px]:w-full max-[640px]:flex-col max-[640px]:items-stretch",
};






