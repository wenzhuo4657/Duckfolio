import type { ComponentProps } from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type IconOption = {
  keywords: string[];
  label: string;
  value: string;
};

export const iconOptions: IconOption[] = [
  {
    keywords: ['github', 'code', 'repository', 'git', '代码', '仓库'],
    label: 'GitHub',
    value: 'Github',
  },
  {
    keywords: ['email', 'mail', 'contact', '邮箱', '邮件', '联系'],
    label: '邮箱',
    value: 'Mail',
  },
  {
    keywords: ['at', 'mention', 'email', '提及', '邮箱'],
    label: '提及',
    value: 'AtSign',
  },
  {
    keywords: ['twitter', 'x', 'social', '推特', '社交'],
    label: 'Twitter / X',
    value: 'Twitter',
  },
  {
    keywords: ['telegram', 'send', 'message', '电报', '消息'],
    label: 'Telegram',
    value: 'Send',
  },
  {
    keywords: ['message', 'chat', 'comment', '聊天', '评论'],
    label: '聊天',
    value: 'MessageCircle',
  },
  {
    keywords: ['message', 'square', 'comment', '留言', '评论'],
    label: '留言',
    value: 'MessageSquare',
  },
  {
    keywords: ['phone', 'call', '电话', '通话'],
    label: '电话',
    value: 'Phone',
  },
  { keywords: ['rss', 'feed', '订阅'], label: '订阅', value: 'Rss' },
  {
    keywords: ['linkedin', 'work', 'career', '职场'],
    label: 'LinkedIn',
    value: 'Linkedin',
  },
  {
    keywords: ['youtube', 'video', 'channel', '视频', '频道'],
    label: 'YouTube',
    value: 'Youtube',
  },
  {
    keywords: ['instagram', 'photo', 'social', '照片'],
    label: 'Instagram',
    value: 'Instagram',
  },
  {
    keywords: ['terminal', 'cli', 'ssh', 'shell', '终端', '命令行'],
    label: '终端',
    value: 'TerminalSquare',
  },
  {
    keywords: ['code', 'programming', 'dev', '代码', '开发'],
    label: '代码',
    value: 'Code2',
  },
  {
    keywords: ['braces', 'json', 'api', '代码', '接口'],
    label: '接口',
    value: 'Braces',
  },
  {
    keywords: ['file code', 'source', '源码', '代码文件'],
    label: '代码文件',
    value: 'FileCode2',
  },
  { keywords: ['binary', 'code', '二进制'], label: '二进制', value: 'Binary' },
  {
    keywords: ['bug', 'debug', 'issue', '调试', '问题'],
    label: '调试',
    value: 'Bug',
  },
  {
    keywords: ['git', 'branch', 'version', '分支', '版本'],
    label: '分支',
    value: 'GitBranch',
  },
  {
    keywords: ['commit', 'git', '提交'],
    label: '提交',
    value: 'GitCommitHorizontal',
  },
  {
    keywords: ['pull request', 'merge', 'pr', '合并'],
    label: '合并请求',
    value: 'GitPullRequest',
  },
  {
    keywords: ['workflow', 'automation', '自动化', '流程'],
    label: '自动化',
    value: 'Workflow',
  },
  {
    keywords: ['web', 'browser', 'site', '网站', '浏览器'],
    label: '网站',
    value: 'Globe',
  },
  { keywords: ['app', 'window', '应用'], label: '应用', value: 'AppWindow' },
  {
    keywords: ['mobile', 'phone', 'app', '手机', '移动端'],
    label: '移动端',
    value: 'Smartphone',
  },
  {
    keywords: ['desktop', 'monitor', 'screen', '桌面', '屏幕'],
    label: '桌面端',
    value: 'Monitor',
  },
  {
    keywords: ['tool', 'wrench', 'utility', '工具'],
    label: '工具',
    value: 'Wrench',
  },
  {
    keywords: ['settings', 'config', 'gear', '设置', '配置'],
    label: '设置',
    value: 'Settings',
  },
  {
    keywords: ['sliders', 'control', '调节', '控制'],
    label: '调节',
    value: 'SlidersHorizontal',
  },
  {
    keywords: ['package', 'library', 'npm', '包', '库'],
    label: '包 / 库',
    value: 'PackageSearch',
  },
  { keywords: ['box', 'archive', '盒子', '归档'], label: '盒子', value: 'Box' },
  {
    keywords: ['archive', 'storage', '归档', '存档'],
    label: '归档',
    value: 'Archive',
  },
  {
    keywords: ['layers', 'stack', 'architecture', '层级', '架构'],
    label: '层级',
    value: 'Layers3',
  },
  {
    keywords: ['boxes', 'module', '组件', '模块'],
    label: '模块',
    value: 'Boxes',
  },
  {
    keywords: ['component', 'puzzle', '组件', '插件'],
    label: '组件',
    value: 'Puzzle',
  },
  {
    keywords: ['sparkles', 'ai', 'magic', '智能', '灵感'],
    label: '灵感',
    value: 'Sparkles',
  },
  {
    keywords: ['bot', 'robot', 'ai', '机器人', '智能'],
    label: '机器人',
    value: 'Bot',
  },
  {
    keywords: ['brain', 'ai', 'thinking', '大脑', '思考'],
    label: '思考',
    value: 'Brain',
  },
  {
    keywords: ['cpu', 'chip', 'processor', '芯片', '处理器'],
    label: '芯片',
    value: 'Cpu',
  },
  {
    keywords: ['scan', 'ai', '识别', '扫描'],
    label: '扫描',
    value: 'ScanSearch',
  },
  {
    keywords: ['zap', 'fast', 'performance', '闪电', '性能'],
    label: '性能',
    value: 'Zap',
  },
  {
    keywords: ['rocket', 'launch', 'deploy', '发布', '部署'],
    label: '发布',
    value: 'Rocket',
  },
  {
    keywords: ['compass', 'navigation', 'guide', '导航', '指南'],
    label: '导航',
    value: 'Compass',
  },
  {
    keywords: ['book', 'docs', 'blog', '文档', '博客'],
    label: '文档',
    value: 'BookOpen',
  },
  {
    keywords: ['newspaper', 'article', 'post', '文章', '新闻'],
    label: '文章',
    value: 'Newspaper',
  },
  {
    keywords: ['pen', 'edit', 'write', '写作', '编辑'],
    label: '写作',
    value: 'PenLine',
  },
  { keywords: ['link', 'url', '链接'], label: '链接', value: 'Link' },
  {
    keywords: ['external', 'open', '跳转', '外链'],
    label: '外链',
    value: 'ExternalLink',
  },
  {
    keywords: ['server', 'backend', '后端', '服务器'],
    label: '服务器',
    value: 'Server',
  },
  {
    keywords: ['database', 'data', 'db', '数据', '数据库'],
    label: '数据库',
    value: 'Database',
  },
  {
    keywords: ['cloud', 'hosting', 'deploy', '云', '托管'],
    label: '云服务',
    value: 'Cloud',
  },
  {
    keywords: ['upload', 'cloud', '上传'],
    label: '上传',
    value: 'UploadCloud',
  },
  {
    keywords: ['download', 'cloud', '下载'],
    label: '下载',
    value: 'DownloadCloud',
  },
  {
    keywords: ['shield', 'security', 'auth', '安全', '认证'],
    label: '安全',
    value: 'ShieldCheck',
  },
  {
    keywords: ['lock', 'private', 'password', '锁定', '私有'],
    label: '锁定',
    value: 'LockKeyhole',
  },
  {
    keywords: ['unlock', 'public', '解锁', '公开'],
    label: '解锁',
    value: 'UnlockKeyhole',
  },
  {
    keywords: ['key', 'auth', 'token', '密钥', '认证'],
    label: '密钥',
    value: 'KeyRound',
  },
  {
    keywords: ['image', 'media', 'gallery', '图片', '媒体'],
    label: '图片',
    value: 'Image',
  },
  {
    keywords: ['camera', 'photo', '摄影', '相机'],
    label: '相机',
    value: 'Camera',
  },
  {
    keywords: ['gallery', 'images', '相册', '图库'],
    label: '相册',
    value: 'Images',
  },
  {
    keywords: ['music', 'audio', 'sound', '音乐', '音频'],
    label: '音频',
    value: 'Music',
  },
  {
    keywords: ['headphone', 'audio', '耳机', '音频'],
    label: '耳机',
    value: 'Headphones',
  },
  {
    keywords: ['video', 'film', 'media', '视频'],
    label: '视频',
    value: 'Video',
  },
  {
    keywords: ['clapperboard', 'movie', '影视', '电影'],
    label: '影视',
    value: 'Clapperboard',
  },
  {
    keywords: ['game', 'controller', '游戏'],
    label: '游戏',
    value: 'Gamepad2',
  },
  {
    keywords: ['dice', 'random', '随机', '游戏'],
    label: '随机',
    value: 'Dices',
  },
  {
    keywords: ['palette', 'design', 'color', '设计', '颜色'],
    label: '设计',
    value: 'Palette',
  },
  {
    keywords: ['paintbrush', 'draw', '绘画', '绘制'],
    label: '绘制',
    value: 'Paintbrush',
  },
  {
    keywords: ['chart', 'analytics', '统计', '图表'],
    label: '统计',
    value: 'ChartNoAxesColumn',
  },
  {
    keywords: ['line chart', 'trend', '趋势', '折线图'],
    label: '趋势',
    value: 'ChartLine',
  },
  { keywords: ['pie chart', '比例', '饼图'], label: '比例', value: 'ChartPie' },
  {
    keywords: ['activity', 'monitoring', '状态', '监控'],
    label: '监控',
    value: 'Activity',
  },
  {
    keywords: ['calendar', 'date', '日历', '日期'],
    label: '日历',
    value: 'Calendar',
  },
  { keywords: ['clock', 'time', '时间'], label: '时间', value: 'Clock' },
  {
    keywords: ['map', 'location', '地图', '位置'],
    label: '地图',
    value: 'Map',
  },
  {
    keywords: ['pin', 'location', '定位', '位置'],
    label: '定位',
    value: 'MapPin',
  },
  { keywords: ['home', 'homepage', '首页'], label: '首页', value: 'House' },
  {
    keywords: ['user', 'profile', 'me', '用户', '个人'],
    label: '用户',
    value: 'User',
  },
  {
    keywords: ['users', 'team', '团队', '用户组'],
    label: '团队',
    value: 'Users',
  },
  {
    keywords: ['star', 'favorite', 'featured', '星标', '推荐'],
    label: '推荐',
    value: 'Star',
  },
  {
    keywords: ['heart', 'like', 'love', '喜欢'],
    label: '喜欢',
    value: 'Heart',
  },
  {
    keywords: ['award', 'badge', 'prize', '奖项', '徽章'],
    label: '徽章',
    value: 'Award',
  },
  {
    keywords: ['trophy', 'winner', '奖杯', '成就'],
    label: '奖杯',
    value: 'Trophy',
  },
  {
    keywords: ['bookmark', 'save', '收藏', '书签'],
    label: '收藏',
    value: 'Bookmark',
  },
  { keywords: ['tag', 'label', '标签'], label: '标签', value: 'Tag' },
  { keywords: ['flag', 'mark', '旗帜', '标记'], label: '旗帜', value: 'Flag' },
  {
    keywords: ['folder', 'directory', '目录', '文件夹'],
    label: '文件夹',
    value: 'Folder',
  },
  {
    keywords: ['folder open', 'directory', '打开目录'],
    label: '打开目录',
    value: 'FolderOpen',
  },
  {
    keywords: ['files', 'documents', '文件', '文档'],
    label: '文件组',
    value: 'Files',
  },
  {
    keywords: ['file text', 'document', '文本', '文件'],
    label: '文本文件',
    value: 'FileText',
  },
  {
    keywords: ['file image', 'picture', '图片文件'],
    label: '图片文件',
    value: 'FileImage',
  },
  {
    keywords: ['file archive', 'zip', '压缩包'],
    label: '压缩包',
    value: 'FileArchive',
  },
  {
    keywords: ['file json', 'json', '配置文件'],
    label: 'JSON',
    value: 'FileJson',
  },
  {
    keywords: ['search', 'find', '搜索', '查找'],
    label: '搜索',
    value: 'Search',
  },
  { keywords: ['filter', '筛选', '过滤'], label: '筛选', value: 'Filter' },
  {
    keywords: ['dashboard', 'panel', '仪表盘', '面板'],
    label: '仪表盘',
    value: 'LayoutDashboard',
  },
  { keywords: ['table', 'spreadsheet', '表格'], label: '表格', value: 'Table' },
  { keywords: ['kanban', 'board', '看板'], label: '看板', value: 'Kanban' },
  {
    keywords: ['clipboard', 'todo', '任务', '清单'],
    label: '任务清单',
    value: 'ClipboardList',
  },
  {
    keywords: ['check', 'done', '完成', '勾选'],
    label: '完成',
    value: 'CircleCheck',
  },
  {
    keywords: ['alert', 'warning', '警告', '提醒'],
    label: '警告',
    value: 'TriangleAlert',
  },
  { keywords: ['info', 'information', '信息'], label: '信息', value: 'Info' },
  { keywords: ['bell', 'notification', '通知'], label: '通知', value: 'Bell' },
  {
    keywords: ['megaphone', 'announce', '公告'],
    label: '公告',
    value: 'Megaphone',
  },
  {
    keywords: ['wifi', 'network', '无线', '网络'],
    label: '无线网络',
    value: 'Wifi',
  },
  {
    keywords: ['hard drive', 'disk', '硬盘', '存储'],
    label: '硬盘',
    value: 'HardDrive',
  },
  {
    keywords: ['keyboard', 'input', '键盘', '输入'],
    label: '键盘',
    value: 'Keyboard',
  },
  { keywords: ['printer', 'print', '打印'], label: '打印机', value: 'Printer' },
  { keywords: ['qr', 'qrcode', '二维码'], label: '二维码', value: 'QrCode' },
  {
    keywords: ['credit card', 'payment', '支付', '银行卡'],
    label: '支付',
    value: 'CreditCard',
  },
  { keywords: ['wallet', 'money', '钱包'], label: '钱包', value: 'Wallet' },
  {
    keywords: ['shopping cart', 'shop', '购物车'],
    label: '购物车',
    value: 'ShoppingCart',
  },
  {
    keywords: ['briefcase', 'business', '工作', '商务'],
    label: '工作',
    value: 'BriefcaseBusiness',
  },
  {
    keywords: ['building', 'company', '公司', '建筑'],
    label: '公司',
    value: 'Building2',
  },
  {
    keywords: ['school', 'education', '学校', '教育'],
    label: '学校',
    value: 'School',
  },
  {
    keywords: ['flask', 'experiment', '实验'],
    label: '实验',
    value: 'FlaskConical',
  },
  { keywords: ['atom', 'science', '科学'], label: '科学', value: 'Atom' },
  {
    keywords: ['route', 'path', '路线', '路径'],
    label: '路线',
    value: 'Route',
  },
  {
    keywords: ['plane', 'travel', '飞机', '旅行'],
    label: '飞机',
    value: 'Plane',
  },
  { keywords: ['car', 'vehicle', '汽车'], label: '汽车', value: 'Car' },
  {
    keywords: ['truck', 'delivery', '运输', '配送'],
    label: '运输',
    value: 'Truck',
  },
  { keywords: ['coffee', 'drink', '咖啡'], label: '咖啡', value: 'Coffee' },
  { keywords: ['gift', 'present', '礼物'], label: '礼物', value: 'Gift' },
  { keywords: ['smile', 'emoji', '表情'], label: '表情', value: 'Smile' },
  {
    keywords: ['handshake', 'partner', '合作'],
    label: '合作',
    value: 'Handshake',
  },
  {
    keywords: ['languages', 'translate', '语言', '翻译'],
    label: '语言',
    value: 'Languages',
  },
  {
    keywords: ['library', 'books', '资料库', '图书馆'],
    label: '资料库',
    value: 'LibraryBig',
  },
];

const iconAliases: Record<string, string> = {
  code: 'Code2',
  github: 'Github',
  layers: 'Layers3',
  mail: 'Mail',
  package: 'PackageSearch',
  send: 'Send',
  telegram: 'Send',
  terminal: 'TerminalSquare',
  tool: 'Wrench',
  twitter: 'Twitter',
  x: 'Twitter',
};

const lucideIconMap = LucideIcons as unknown as Record<string, LucideIcon>;

function toPascalCase(value: string) {
  return value
    .trim()
    .replace(/(?:^|[-_\s]+)([a-z0-9])/gi, (_, char: string) =>
      char.toUpperCase(),
    )
    .replace(/[^a-zA-Z0-9]/g, '');
}

export function resolveLucideIcon(iconName?: string) {
  const trimmedName = iconName?.trim();
  if (!trimmedName || trimmedName.startsWith('<svg')) {
    return null;
  }

  const alias = iconAliases[trimmedName.toLowerCase()];
  const pascalName = toPascalCase(trimmedName);

  return (
    lucideIconMap[alias || trimmedName] || lucideIconMap[pascalName] || null
  );
}

export function ConfigIcon({
  className,
  fallback: FallbackIcon = LucideIcons.Circle,
  icon,
  svgClassName,
  ...props
}: ComponentProps<LucideIcon> & {
  fallback?: LucideIcon;
  icon?: string;
  svgClassName?: string;
}) {
  const Icon = resolveLucideIcon(icon) || FallbackIcon;

  if (icon?.trim().startsWith('<svg')) {
    return (
      <span
        className={svgClassName || className}
        dangerouslySetInnerHTML={{ __html: icon }}
      />
    );
  }

  return <Icon className={className} {...props} />;
}
