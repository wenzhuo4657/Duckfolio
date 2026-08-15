'use client';

import { type ReactNode, useCallback, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Save,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  ConfigIcon,
  iconOptions,
  resolveLucideIcon,
} from '@/lib/icon-registry';
import { cn } from '@/lib/utils';
import type {
  ProfileConfig,
  ProjectLink,
  ProjectSection,
  SocialLink,
  WebsiteLink,
} from '@/types/platform-config';
import { Field, IconButton } from './AdminShared';
import { createId } from './utils';

type ConfigSectionKey = 'profile' | 'social' | 'website' | 'projects';

const ICONS_PER_PAGE = 12;

const TEXT = {
  add: '\u6dfb\u52a0',
  addGroup: '\u6dfb\u52a0\u5206\u7ec4',
  addProject: '\u6dfb\u52a0\u9879\u76ee',
  avatarPath: '\u5934\u50cf\u8def\u5f84',
  bio: '\u7b80\u4ecb',
  delete: '\u5220\u9664',
  deleteGroup: '\u5220\u9664\u5206\u7ec4',
  deleteProject: '\u5220\u9664\u9879\u76ee',
  description: '\u63cf\u8ff0',
  groupSuffix: '\u7ec4',
  icon: '\u56fe\u6807',
  iconNextPage: '\u4e0b\u4e00\u9875',
  iconPage: '\u9875',
  iconPreviousPage: '\u4e0a\u4e00\u9875',
  iconSearch: '\u641c\u7d22\u56fe\u6807...',
  iconUnknown: '\u5f53\u524d\u56fe\u6807',
  itemSuffix: '\u9879',
  name: '\u540d\u79f0',
  noProjectGroups: '\u8fd8\u6ca1\u6709\u9879\u76ee\u5206\u7ec4\u3002',
  noProjectsInGroup:
    '\u8fd9\u4e2a\u5206\u7ec4\u8fd8\u6ca1\u6709\u9879\u76ee\u3002',
  noSocial: '\u8fd8\u6ca1\u6709\u793e\u4ea4\u94fe\u63a5\u3002',
  noWebsite: '\u8fd8\u6ca1\u6709\u7f51\u7ad9\u94fe\u63a5\u3002',
  platform: '\u5e73\u53f0',
  profileDesc:
    '\u7ad9\u70b9\u540d\u79f0\u3001\u5934\u50cf\u548c\u7b80\u4ecb\u3002',
  profileMeta: '\u57fa\u7840',
  profileTitle: '\u57fa\u7840\u8d44\u6599',
  projectsDesc:
    'Projects \u9875\u9762\u5c55\u793a\u7684\u9879\u76ee\u5206\u7c7b\u548c\u9879\u76ee\u3002',
  projectsTitle: '\u9879\u76ee\u5206\u7ec4',
  save: '\u4fdd\u5b58\u914d\u7f6e',
  sectionId: '\u5206\u7ec4 ID',
  sectionTitle: '\u5206\u7ec4\u6807\u9898',
  socialDesc:
    '\u9996\u9875\u5c55\u793a\u7684\u793e\u4ea4\u5e73\u53f0\u5165\u53e3\u3002',
  socialTitle: '\u793e\u4ea4\u94fe\u63a5',
  title: '\u6807\u9898',
  websiteDesc:
    'Links \u9875\u9762\u5c55\u793a\u7684\u7f51\u7ad9\u5165\u53e3\u3002',
  websiteTitle: '\u7f51\u7ad9\u94fe\u63a5',
} as const;

export function ConfigPanel({
  config,
  isSaving,
  onConfigChange,
  onSave,
}: {
  config: ProfileConfig;
  isSaving: boolean;
  onConfigChange: (config: ProfileConfig) => void;
  onSave: () => void;
}) {
  const [openSections, setOpenSections] = useState<Set<ConfigSectionKey>>(
    () => new Set(),
  );
  const projectSections = config.projectSections || [];

  const isSectionOpen = useCallback(
    (section: ConfigSectionKey) => openSections.has(section),
    [openSections],
  );

  const openConfigSection = useCallback((section: ConfigSectionKey) => {
    setOpenSections((current) => {
      const next = new Set(current);
      next.add(section);
      return next;
    });
  }, []);

  const toggleConfigSection = useCallback((section: ConfigSectionKey) => {
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  }, []);

  const setProfile = (profile: Partial<ProfileConfig['profile']>) => {
    onConfigChange({
      ...config,
      profile: {
        ...config.profile,
        ...profile,
      },
    });
  };

  const updateSocialLink = (index: number, patch: Partial<SocialLink>) => {
    onConfigChange({
      ...config,
      socialLinks: config.socialLinks.map((link, linkIndex) =>
        linkIndex === index ? { ...link, ...patch } : link,
      ),
    });
  };

  const updateWebsiteLink = (index: number, patch: Partial<WebsiteLink>) => {
    onConfigChange({
      ...config,
      websiteLinks: config.websiteLinks.map((link, linkIndex) =>
        linkIndex === index ? { ...link, ...patch } : link,
      ),
    });
  };

  const updateProjectSection = (
    index: number,
    patch: Partial<ProjectSection>,
  ) => {
    onConfigChange({
      ...config,
      projectSections: projectSections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, ...patch } : section,
      ),
    });
  };

  const updateProject = (
    sectionIndex: number,
    projectIndex: number,
    patch: Partial<ProjectLink>,
  ) => {
    onConfigChange({
      ...config,
      projectSections: projectSections.map((section, currentSectionIndex) =>
        currentSectionIndex === sectionIndex
          ? {
              ...section,
              projects: section.projects.map((project, currentProjectIndex) =>
                currentProjectIndex === projectIndex
                  ? { ...project, ...patch }
                  : project,
              ),
            }
          : section,
      ),
    });
  };

  return (
    <section className="grid gap-4">
      <ConfigAccordionSection
        description={TEXT.profileDesc}
        isOpen={isSectionOpen('profile')}
        meta={TEXT.profileMeta}
        title={TEXT.profileTitle}
        onToggle={() => toggleConfigSection('profile')}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Field label={TEXT.name}>
            <input
              className="admin-input"
              value={config.profile.name}
              onChange={(event) => setProfile({ name: event.target.value })}
            />
          </Field>
          <Field label={TEXT.avatarPath}>
            <input
              className="admin-input"
              value={config.profile.avatar}
              onChange={(event) => setProfile({ avatar: event.target.value })}
            />
          </Field>
          <Field label={TEXT.bio}>
            <input
              className="admin-input"
              value={config.profile.bio}
              onChange={(event) => setProfile({ bio: event.target.value })}
            />
          </Field>
        </div>
      </ConfigAccordionSection>

      <ConfigAccordionSection
        actionLabel={TEXT.add}
        description={TEXT.socialDesc}
        isOpen={isSectionOpen('social')}
        meta={`${config.socialLinks.length} ${TEXT.itemSuffix}`}
        title={TEXT.socialTitle}
        onAction={() => {
          onConfigChange({
            ...config,
            socialLinks: [
              ...config.socialLinks,
              { icon: '', id: createId('social'), platform: '', url: '' },
            ],
          });
          openConfigSection('social');
        }}
        onToggle={() => toggleConfigSection('social')}
      >
        {config.socialLinks.length ? (
          <div className="grid gap-4">
            {config.socialLinks.map((link, index) => (
              <div
                key={link.id || index}
                className="grid gap-3 rounded-lg border border-[#121212]/10 p-4 dark:border-white/10"
              >
                <div className="grid gap-3 md:grid-cols-[1fr_1fr_2fr_12rem_auto]">
                  <input
                    className="admin-input"
                    placeholder="id"
                    value={link.id}
                    onChange={(event) =>
                      updateSocialLink(index, { id: event.target.value })
                    }
                  />
                  <input
                    className="admin-input"
                    placeholder={TEXT.platform}
                    value={link.platform}
                    onChange={(event) =>
                      updateSocialLink(index, { platform: event.target.value })
                    }
                  />
                  <input
                    className="admin-input"
                    placeholder="URL"
                    value={link.url}
                    onChange={(event) =>
                      updateSocialLink(index, { url: event.target.value })
                    }
                  />
                  <IconPicker
                    value={link.icon}
                    onChange={(icon) => updateSocialLink(index, { icon })}
                  />
                  <IconButton
                    label={TEXT.delete}
                    onClick={() =>
                      onConfigChange({
                        ...config,
                        socialLinks: config.socialLinks.filter(
                          (_, linkIndex) => linkIndex !== index,
                        ),
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyConfigText>{TEXT.noSocial}</EmptyConfigText>
        )}
      </ConfigAccordionSection>

      <ConfigAccordionSection
        actionLabel={TEXT.add}
        description={TEXT.websiteDesc}
        isOpen={isSectionOpen('website')}
        meta={`${config.websiteLinks.length} ${TEXT.itemSuffix}`}
        title={TEXT.websiteTitle}
        onAction={() => {
          onConfigChange({
            ...config,
            websiteLinks: [
              ...config.websiteLinks,
              {
                description: '',
                id: createId('link'),
                title: '',
                url: '',
              },
            ],
          });
          openConfigSection('website');
        }}
        onToggle={() => toggleConfigSection('website')}
      >
        {config.websiteLinks.length ? (
          <div className="grid gap-4">
            {config.websiteLinks.map((link, index) => (
              <div
                key={link.id || index}
                className="grid gap-3 rounded-lg border border-[#121212]/10 p-4 dark:border-white/10 md:grid-cols-[1fr_1fr_2fr_2fr_auto]"
              >
                <input
                  className="admin-input"
                  placeholder="id"
                  value={link.id}
                  onChange={(event) =>
                    updateWebsiteLink(index, { id: event.target.value })
                  }
                />
                <input
                  className="admin-input"
                  placeholder={TEXT.title}
                  value={link.title}
                  onChange={(event) =>
                    updateWebsiteLink(index, { title: event.target.value })
                  }
                />
                <input
                  className="admin-input"
                  placeholder="URL"
                  value={link.url}
                  onChange={(event) =>
                    updateWebsiteLink(index, { url: event.target.value })
                  }
                />
                <input
                  className="admin-input"
                  placeholder={TEXT.description}
                  value={link.description || ''}
                  onChange={(event) =>
                    updateWebsiteLink(index, {
                      description: event.target.value,
                    })
                  }
                />
                <IconButton
                  label={TEXT.delete}
                  onClick={() =>
                    onConfigChange({
                      ...config,
                      websiteLinks: config.websiteLinks.filter(
                        (_, linkIndex) => linkIndex !== index,
                      ),
                    })
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyConfigText>{TEXT.noWebsite}</EmptyConfigText>
        )}
      </ConfigAccordionSection>

      <ConfigAccordionSection
        actionLabel={TEXT.addGroup}
        description={TEXT.projectsDesc}
        isOpen={isSectionOpen('projects')}
        meta={`${projectSections.length} ${TEXT.groupSuffix}`}
        title={TEXT.projectsTitle}
        onAction={() => {
          onConfigChange({
            ...config,
            projectSections: [
              ...projectSections,
              {
                id: createId('project-section'),
                projects: [],
                title: '',
              },
            ],
          });
          openConfigSection('projects');
        }}
        onToggle={() => toggleConfigSection('projects')}
      >
        {projectSections.length ? (
          <div className="grid gap-6">
            {projectSections.map((section, sectionIndex) => (
              <div key={section.id || sectionIndex} className="grid gap-4">
                <div className="grid gap-3 border-b border-[#121212]/10 pb-3 dark:border-white/10 md:grid-cols-[1fr_2fr_auto_auto]">
                  <input
                    className="admin-input"
                    placeholder={TEXT.sectionId}
                    value={section.id}
                    onChange={(event) =>
                      updateProjectSection(sectionIndex, {
                        id: event.target.value,
                      })
                    }
                  />
                  <input
                    className="admin-input"
                    placeholder={TEXT.sectionTitle}
                    value={section.title}
                    onChange={(event) =>
                      updateProjectSection(sectionIndex, {
                        title: event.target.value,
                      })
                    }
                  />
                  <Button
                    className="gap-2"
                    type="button"
                    variant="outline"
                    onClick={() =>
                      updateProjectSection(sectionIndex, {
                        projects: [
                          ...section.projects,
                          {
                            description: '',
                            icon: 'TerminalSquare',
                            id: createId('project'),
                            title: '',
                            url: '',
                          },
                        ],
                      })
                    }
                  >
                    <Plus className="size-4" />
                    {TEXT.addProject}
                  </Button>
                  <IconButton
                    label={TEXT.deleteGroup}
                    onClick={() =>
                      onConfigChange({
                        ...config,
                        projectSections: projectSections.filter(
                          (_, currentIndex) => currentIndex !== sectionIndex,
                        ),
                      })
                    }
                  />
                </div>

                {section.projects.length ? (
                  <div className="grid gap-3">
                    {section.projects.map((project, projectIndex) => (
                      <div
                        key={project.id || projectIndex}
                        className="grid gap-3 rounded-lg border border-[#121212]/10 p-4 dark:border-white/10 md:grid-cols-[1fr_1.5fr_2fr_2fr_1fr_auto]"
                      >
                        <input
                          className="admin-input"
                          placeholder="id"
                          value={project.id}
                          onChange={(event) =>
                            updateProject(sectionIndex, projectIndex, {
                              id: event.target.value,
                            })
                          }
                        />
                        <input
                          className="admin-input"
                          placeholder={TEXT.title}
                          value={project.title}
                          onChange={(event) =>
                            updateProject(sectionIndex, projectIndex, {
                              title: event.target.value,
                            })
                          }
                        />
                        <input
                          className="admin-input"
                          placeholder="URL"
                          value={project.url}
                          onChange={(event) =>
                            updateProject(sectionIndex, projectIndex, {
                              url: event.target.value,
                            })
                          }
                        />
                        <input
                          className="admin-input"
                          placeholder={TEXT.description}
                          value={project.description || ''}
                          onChange={(event) =>
                            updateProject(sectionIndex, projectIndex, {
                              description: event.target.value,
                            })
                          }
                        />
                        <IconPicker
                          value={project.icon || ''}
                          onChange={(icon) =>
                            updateProject(sectionIndex, projectIndex, { icon })
                          }
                        />
                        <IconButton
                          label={TEXT.deleteProject}
                          onClick={() =>
                            updateProjectSection(sectionIndex, {
                              projects: section.projects.filter(
                                (_, currentProjectIndex) =>
                                  currentProjectIndex !== projectIndex,
                              ),
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyConfigText>{TEXT.noProjectsInGroup}</EmptyConfigText>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyConfigText>{TEXT.noProjectGroups}</EmptyConfigText>
        )}
      </ConfigAccordionSection>

      <div className="flex justify-end pt-2">
        <Button
          className="admin-primary-button"
          disabled={isSaving}
          type="button"
          onClick={onSave}
        >
          {isSaving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {TEXT.save}
        </Button>
      </div>
    </section>
  );
}

function ConfigAccordionSection({
  actionLabel,
  children,
  description,
  isOpen,
  meta,
  title,
  onAction,
  onToggle,
}: {
  actionLabel?: string;
  children: ReactNode;
  description: string;
  isOpen: boolean;
  meta: string;
  title: string;
  onAction?: () => void;
  onToggle: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#121212]/10 bg-white/40 dark:border-white/10 dark:bg-white/[0.02]">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          type="button"
          onClick={onToggle}
        >
          <ChevronDown
            className={`size-4 shrink-0 text-[#121212]/45 transition-transform dark:text-white/45 ${
              isOpen ? 'rotate-0' : '-rotate-90'
            }`}
          />
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-base font-medium">{title}</span>
              <span className="rounded bg-[#121212]/5 px-2 py-0.5 text-xs text-[#121212]/45 dark:bg-white/10 dark:text-white/45">
                {meta}
              </span>
            </span>
            <span className="mt-1 block text-sm text-[#121212]/45 dark:text-white/45">
              {description}
            </span>
          </span>
        </button>

        {onAction && (
          <Button
            className="gap-2"
            size="sm"
            type="button"
            variant="outline"
            onClick={onAction}
          >
            <Plus className="size-4" />
            {actionLabel || TEXT.add}
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="border-t border-[#121212]/10 p-4 dark:border-white/10">
          {children}
        </div>
      )}
    </section>
  );
}

function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const normalizedValue = value.trim();
  const hasCurrentOption = iconOptions.some(
    (option) => option.value === normalizedValue,
  );
  const currentOptions =
    normalizedValue && !hasCurrentOption && resolveLucideIcon(normalizedValue)
      ? [
          {
            keywords: [normalizedValue],
            label: TEXT.iconUnknown,
            value: normalizedValue,
          },
        ]
      : [];
  const options = [...currentOptions, ...iconOptions];
  const normalizedSearch = search.trim().toLowerCase();
  const filteredOptions = normalizedSearch
    ? options.filter((option) =>
        [option.label, option.value, ...option.keywords]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch),
      )
    : options;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredOptions.length / ICONS_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages - 1);
  const pagedOptions = filteredOptions.slice(
    safePage * ICONS_PER_PAGE,
    safePage * ICONS_PER_PAGE + ICONS_PER_PAGE,
  );
  const selectedOption = options.find(
    (option) => option.value === normalizedValue,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="h-10 justify-between rounded-md border border-[#121212]/10 bg-white px-3 text-[#121212] hover:bg-[#121212]/5 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-white/10"
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
        >
          <span className="flex min-w-0 items-center gap-2">
            <ConfigIcon className="size-4 shrink-0" icon={normalizedValue} />
            <span className="truncate">
              {selectedOption?.label || TEXT.icon}
            </span>
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(21rem,calc(100vw-2rem))] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={TEXT.iconSearch}
            value={search}
            onValueChange={(nextSearch) => {
              setSearch(nextSearch);
              setPage(0);
            }}
          />
          <CommandList className="max-h-none p-2.5">
            {filteredOptions.length ? (
              <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                {pagedOptions.map((option) => (
                  <button
                    key={option.value}
                    className={cn(
                      'group relative grid h-14 place-items-center gap-0.5 rounded-md border border-[#121212]/10 bg-white/70 px-1 py-1 text-center text-[11px] transition-colors hover:border-[#121212]/25 hover:bg-[#121212]/5 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/25 dark:hover:bg-white/10',
                      normalizedValue === option.value &&
                        'border-[#121212]/45 bg-[#121212]/10 dark:border-white/45 dark:bg-white/15',
                    )}
                    title={`${option.label} (${option.value})`}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <ConfigIcon
                      className="size-4.5 text-[#121212]/70 transition-colors group-hover:text-[#121212] dark:text-white/70 dark:group-hover:text-white"
                      icon={option.value}
                    />
                    <span className="line-clamp-1 w-full text-[#121212]/55 dark:text-white/55">
                      {option.label}
                    </span>
                    {normalizedValue === option.value && (
                      <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-[#121212] text-white dark:bg-white dark:text-black">
                        <Check className="size-3" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <CommandEmpty>
                <div className="grid gap-2 px-4 py-2 text-center text-sm text-[#121212]/50 dark:text-white/50">
                  <Search className="mx-auto size-4" />
                  <span>没有找到匹配的图标</span>
                </div>
              </CommandEmpty>
            )}
          </CommandList>
          {filteredOptions.length > ICONS_PER_PAGE && (
            <div className="flex items-center justify-between border-t border-[#121212]/10 px-3 py-2 text-xs text-[#121212]/45 dark:border-white/10 dark:text-white/45">
              <Button
                className="h-7 gap-1 px-2"
                disabled={safePage === 0}
                size="sm"
                type="button"
                variant="ghost"
                onClick={() =>
                  setPage((currentPage) => Math.max(0, currentPage - 1))
                }
              >
                <ChevronLeft className="size-3.5" />
                {TEXT.iconPreviousPage}
              </Button>
              <span>
                {safePage + 1} / {totalPages} {TEXT.iconPage}
              </span>
              <Button
                className="h-7 gap-1 px-2"
                disabled={safePage >= totalPages - 1}
                size="sm"
                type="button"
                variant="ghost"
                onClick={() =>
                  setPage((currentPage) =>
                    Math.min(totalPages - 1, currentPage + 1),
                  )
                }
              >
                {TEXT.iconNextPage}
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function EmptyConfigText({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-[#121212]/10 px-4 py-6 text-sm text-[#121212]/45 dark:border-white/10 dark:text-white/45">
      {children}
    </div>
  );
}
