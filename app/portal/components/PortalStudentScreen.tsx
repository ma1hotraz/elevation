import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { portalStyles } from "../portalShared";
import type { PortalController } from "../usePortalState";

type PortalStudentScreenProps = {
  portal: PortalController;
};

export function PortalStudentScreen({ portal }: PortalStudentScreenProps) {
  return (
    <main className={portalStyles.page}>
      <header className={portalStyles.portalTopbar}>
        <Link href="/" className={portalStyles.logoRow}>
          <img src="/logo2.png" alt="Elevation Institute" className={portalStyles.logoImage} />
        </Link>
        <div className={portalStyles.userControls}>
          <span>{portal.currentUser?.name}</span>
          <Button type="button" variant="secondary" onClick={portal.logout}>
            <LogOut aria-hidden="true" />
            Sign Out
          </Button>
        </div>
      </header>

      <section className={portalStyles.dashboardHero}>
        <div>
          <p>My Learning Hub</p>
          <h1>Access your assigned course tests and revision links.</h1>
        </div>
        <div className={portalStyles.statsGrid}>
          <span>
            <strong>{portal.visibleResources.length}</strong>
            Materials
          </span>
          <span>
            <strong>{portal.visibleCourses.length}</strong>
            Courses
          </span>
          <span>
            <strong>{portal.groupedResources.filter((group) => group.resources.length > 0).length}</strong>
            Categories
          </span>
        </div>
      </section>

      <section className={portalStyles.courseFilter} aria-label="Course filters">
        <Button
          type="button"
          variant="ghost"
          className={cn(portal.activeCourse === "All" && portalStyles.activeFilter)}
          onClick={() => portal.setActiveCourse("All")}
        >
          All
        </Button>
        {portal.visibleCourses.map((course) => (
          <Button
            type="button"
            variant="ghost"
            key={course}
            className={cn(portal.activeCourse === course && portalStyles.activeFilter)}
            onClick={() => portal.setActiveCourse(course)}
          >
            {course}
          </Button>
        ))}
      </section>

      <section className={portalStyles.resourceGrid}>
        {portal.groupedResources.map(({ category, resources }) => (
          <div className={portalStyles.resourceColumn} key={category}>
            <div className={portalStyles.columnHeader}>
              <h2>{category}</h2>
              <span>{resources.length}</span>
            </div>

            {resources.length > 0 ? (
              resources.map((resource) => (
                <article className={portalStyles.resourceCard} key={resource.id}>
                  <div className={portalStyles.resourceMeta}>
                    <span>{resource.course}</span>
                    <span>{resource.addedOn}</span>
                  </div>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <div className={portalStyles.resourceActions}>
                    <a href={resource.url} target="_blank" rel="noreferrer">
                      <ExternalLink aria-hidden="true" />
                      Open Link
                    </a>
                  </div>
                </article>
              ))
            ) : (
              <p className={portalStyles.emptyState}>No links added here yet.</p>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
