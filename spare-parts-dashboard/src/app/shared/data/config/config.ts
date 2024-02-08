export class ConfigDB {
  static data = {
    light: {
      settings: {
        layout_type: 'ltr',
        sidebar: {
          type: 'default',
          body_type: 'default'
        },
        sidebar_setting: 'default-sidebar',
        sidebar_backround: 'light-sidebar'
      },
      color: {
        layout_version: 'light',
        color: 'color-2',
        primary_color: '#4466f2',
        secondary_color: '#1ea6ec',
        mix_layout: 'light'
      },
      router_animation: 'fadeIn'
    },
    black: {
      settings: {
        layout_type: 'ltr',
        sidebar: {
          type: 'default',
          body_type: 'default'
        },
        sidebar_setting: 'default-sidebar',
        sidebar_backround: 'color2-sidebar'
      },
      color: {
        layout_version: 'dark-header-sidebar-mix',
        color: 'color-2',
        primary_color: '#4466f2',
        secondary_color: '#1ea6ec',
        mix_layout: 'dark-header-sidebar-mix'
      },
      router_animation: 'fadeIn'
    },
    dark: {
      settings: {
        layout_type: 'ltr',
        sidebar: {
          type: 'default',
          body_type: 'default'
        },
        sidebar_setting: 'default-sidebar',
        sidebar_backround: 'dark-sidebar'
      },
      color: {
        layout_version: 'dark-only',
        color: 'color-2',
        primary_color: '#4466f2',
        secondary_color: '#1ea6ec',
        mix_layout: 'dark-only'
      },
      router_animation: 'fadeIn'
    }
  };
}
