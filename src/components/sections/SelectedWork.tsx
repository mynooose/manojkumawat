'use client';

import { useState } from 'react';
import { ALSO_DELIVERED, PROJECTS } from '@/content/projects';
import { Reveal } from '@/components/ui/Reveal';
import { DiagramViewer } from '@/components/ui/DiagramViewer';
import styles from './SelectedWork.module.css';

const pad = (n: number) => String(n + 1).padStart(2, '0');

export function SelectedWork() {
  const [selected, setSelected] = useState(0);
  const [diagramOpen, setDiagramOpen] = useState(false);

  const project = PROJECTS[selected] ?? PROJECTS[0]!;

  return (
    <section id="work" className={`shell ${styles.section}`}>
      <div className={styles.header}>
        <Reveal as="h2" className={styles.heading}>
          <span className={styles.index}>01</span>Selected work
        </Reveal>
        <Reveal as="p" className={styles.counter}>
          {pad(selected)} / {pad(PROJECTS.length - 1)} · client names withheld
        </Reveal>
      </div>

      <Reveal className={styles.layout}>
        {/* Tablist: roving selection over the five projects. */}
        <div className={styles.rail} role="tablist" aria-label="Selected work">
          <p className={styles.railLabel}>Select a project · {PROJECTS.length}</p>

          {PROJECTS.map((item, i) => {
            const active = i === selected;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`work-tab-${item.id}`}
                aria-selected={active}
                aria-controls={`work-panel-${item.id}`}
                tabIndex={active ? 0 : -1}
                className={`${styles.tab} ${active ? styles.tabActive : ''}`}
                onClick={() => setSelected(i)}
              >
                <span className={styles.tabMeta}>
                  {pad(i)}
                  <span className={styles.tabState} aria-hidden="true">
                    {active ? 'Reading' : '→'}
                  </span>
                </span>
                <span className={styles.tabTitle}>{item.title}</span>
              </button>
            );
          })}
        </div>

        <div
          className={styles.panel}
          role="tabpanel"
          id={`work-panel-${project.id}`}
          aria-labelledby={`work-tab-${project.id}`}
        >
          <h3 className={styles.panelTitle}>{project.title}</h3>
          <p className={styles.panelRole}>{project.role}</p>

          <div className={styles.panelBody}>
            <div className={styles.split}>
              <p className={styles.splitLabel}>The problem</p>
              <p className={styles.splitLabel}>What I built</p>
              <p className={`${styles.splitText} ${styles.splitTextFirst}`}>{project.problem}</p>
              <p className={styles.splitText}>{project.built}</p>
            </div>

            <div className={styles.architecture}>
              <p className={styles.blockLabel}>Architecture</p>
              <div className={styles.layers}>
                {project.layers.map((layer) => (
                  <div key={layer.label} className={styles.layer}>
                    <span className={styles.layerLabel}>{layer.label}</span>
                    <span className={styles.layerDetail}>{layer.detail}</span>
                  </div>
                ))}
              </div>
              <p className={styles.stack}>{project.stack.join(' / ')}</p>

              {project.diagram ? (
                <button
                  type="button"
                  className={styles.diagramButton}
                  onClick={() => setDiagramOpen(true)}
                >
                  View the architecture diagram
                  <span aria-hidden="true" className={styles.diagramArrow}>
                    &#8599;
                  </span>
                </button>
              ) : null}
            </div>
          </div>

          <div className={styles.outcome}>
            <p className={styles.blockLabel}>Outcome</p>
            <p className={styles.outcomeText}>{project.outcome}</p>
          </div>
        </div>
      </Reveal>

      <Reveal className={styles.also}>
        <p className={styles.blockLabel}>Also delivered</p>
        <p className={styles.alsoText}>{ALSO_DELIVERED}</p>
      </Reveal>

      {diagramOpen && project.diagram ? (
        <DiagramViewer
          src={project.diagram}
          alt={`Production architecture of the ${project.title}`}
          onClose={() => setDiagramOpen(false)}
        />
      ) : null}
    </section>
  );
}
