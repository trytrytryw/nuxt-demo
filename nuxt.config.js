
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // { rel:"stylesheet", href: 'http://static.wxkydd.com/libs/bootstrap/3.3.4/bootstrap.min.css' },
      { rel:"stylesheet",  href: 'http://static.wxkydd.com/libs/datatable/1.10.11/datatables-rs-bt.min.css' },
      { rel:"stylesheet",  href: 'http://static.wxkydd.com/libs/datatable/buttons/1.4.2/buttons.dataTables.min.css' }
    ],
    script: [
      { src: "http://static.wxkydd.com/libs/jquery/3.2.1/jquery.min.js" },
      // { src:"http://static.wxkydd.com/libs/bootstrap/3.3.4/bootstrap.min.js"},
      { src:"http://static.wxkydd.com/libs/datatable/1.10.11/datatables-rs-bt.min.js"}
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '~/assets/css/components/media.css',
    '~/assets/css/components/public.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {
      src: '~/plugins/ElementUI',
      ssr: true
    },
    {
      src: '~/plugins/axios',
      ssr: false
    }
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios'
  ],
  axios: {
    proxy: true,
    prefix: '/api', // baseURL
    credentials: true
  },
  proxy: {
    '/api/': {
      target: '', // 代理地址
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    vendor: ['element-ui', 'axios'], // 防止重复打包
    extend(config, ctx) {
    }
  }
}
