import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index')
      }
    ]
  },

  {
    path: '/prods',
    component: Layout,
    redirect: '/prods/prod_list',
    name: 'Prods',
    meta: { title: '商品管理', icon: 'prod' },
    children: [
      {
        path: 'prod_list',
        name: 'ProdList',
        component: () => import('@/views/prods/prod_list'),
        meta: { title: '商品列表' }
      },
      {
        path: 'prod_add',
        name: 'prodAdd',
        component: () => import('@/views/prods/prod_add'),
        meta: { title: '添加商品' },
        hidden: true
      },
      {
        path: 'prod_update/:GoodId',
        name: 'prodUpdate',
        component: () => import('@/views/prods/prod_update'),
        meta: { title: '修改商品' },
        hidden: true
      },
      {
        path: 'prod_detail/:GoodId',
        name: 'prodDetail',
        component: () => import('@/views/prods/prod_detail'),
        meta: { title: '商品详情' },
        hidden: true
      },
      {
        path: 'prod_agreement',
        name: 'ProdAgreement',
        component: () => import('@/views/prods/prod_agreement'),
        meta: { title: '协议管理' }
      }
    ]
  },
  {
    path: '/recommend',
    component: Layout,
    children: [
      {
        path: 'recommend_list',
        name: 'RecommendList',
        component: () => import('@/views/recommend/recommend_list'),
        meta: { title: '推荐管理', icon: 'recommend' }
      }
    ]
  },
  {
    path: '/banner',
    component: Layout,
    redirect: '/banner/banner_list',
    name: 'Banner',
    meta: { title: '横幅管理', icon: 'banner' },
    children: [
      {
        path: 'banner_list',
        name: 'BannerList',
        component: () => import('@/views/banner/banner_list'),
        meta: { title: '横幅管理' }
      },
      {
        path: 'banner_add',
        name: 'BannerAdd',
        component: () => import('@/views/banner/banner_add'),
        meta: { title: '横幅添加' },
        hidden: true
      }
    ]
  },
  {
    path: '/love_star',
    component: Layout,
    name: 'LoveStar',
    redirect: '/love_star/ls_list',
    meta: { title: '爱心明星', icon: 'star' },
    children: [
      {
        path: 'ls_list',
        name: 'LsList',
        component: () => import('@/views/love_star/ls_list'),
        meta: { title: '爱心明星管理' }
      }
    ]
  },
  {
    path: '/love_actions',
    component: Layout,
    name: 'LoveActions',
    redirect: 'noredirect',
    meta: { title: '爱心活动', icon: 'action' },
    children: [
      {
        path: 'la_list',
        name: 'LaList',
        component: () => import('@/views/love_actions/la_list'),
        meta: { title: '爱心活动回顾' }
      },
      {
        path: 'la_add',
        name: 'laAdd',
        component: () => import('@/views/love_actions/la_add'),
        meta: { title: '添加爱心活动' },
        hidden: true
      },
      {
        path: 'la_update/:GoodId',
        name: 'laUpdate',
        component: () => import('@/views/love_actions/la_update'),
        meta: { title: '修改爱心活动' },
        hidden: true
      },
      {
        path: 'la_detail/:GoodId',
        name: 'la_detail',
        component: () => import('@/views/love_actions/la_detail'),
        meta: { title: '爱心活动详情' },
        hidden: true
      }
    ]
  },
  {
    path: '/love_progress',
    component: Layout,
    name: 'LoveProgress',
    redirect: 'noredirect',
    meta: { title: '爱心进展管理', icon: 'love' },
    children: [
      {
        path: 'lp_list',
        name: 'LpList',
        component: () => import('@/views/love_progress/lp_list'),
        meta: { title: '爱心项目成员列表' }
      },
      {
        path: 'lp_checkList',
        name: 'LpCheckList',
        component: () => import('@/views/love_progress/lp_checkList'),
        meta: { title: '上报审核列表' }
      }
    ]
  },
  {
    path: '/love_notices',
    component: Layout,
    name: 'LoveNotices',
    redirect: 'noredirect',
    meta: { title: '活动参与', icon: 'notice' },
    children: [
      {
        path: 'ln_list',
        name: 'lnList',
        component: () => import('@/views/love_notices/ln_list'),
        meta: { title: '活动参与管理' }
      },
      {
        path: 'phone',
        name: 'Phone',
        component: () => import('@/views/love_notices/phone'),
        meta: { title: '活动联系电话' }
      },
      {
        path: 'ln_add',
        name: 'lnAdd',
        component: () => import('@/views/love_notices/ln_add'),
        meta: { title: '添加活动参与' },
        hidden: true
      },
      {
        path: 'ln_update/:GoodId',
        name: 'lnUpdate',
        component: () => import('@/views/love_notices/ln_update'),
        meta: { title: '修改活动参与' },
        hidden: true
      },
      {
        path: 'ln_detail/:GoodId',
        name: 'lnDetail',
        component: () => import('@/views/love_notices/ln_detail'),
        meta: { title: '活动参与详情' },
        hidden: true
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: 'noredirect',
    name: 'order',
    meta: { title: '订单管理', icon: 'order' },
    children: [
      {
        path: 'order_list',
        name: 'OrderList',
        component: () => import('@/views/order/order_list'),
        meta: { title: '商品订单列表' }
      },
      {
        path: 'love_list',
        name: 'LoveList',
        component: () => import('@/views/order/love_list'),
        meta: { title: '活动订单列表' }
      }
    ]
  },
  {
    path: '/sort',
    component: Layout,
    redirect: 'noredirect',
    name: 'Sort',
    meta: { title: '排序管理', icon: 'drag' },
    children: [
      {
        path: 'sort_banner',
        name: 'SortBanner',
        component: () => import('@/views/sort/sort_banner'),
        meta: { title: '横幅排序' }
      },
      {
        path: 'sort_recommend',
        name: 'SortRecommend',
        component: () => import('@/views/sort/sort_recommend'),
        meta: { title: '推荐排序' }
      },
      {
        path: 'sort_star',
        name: 'SortStar',
        component: () => import('@/views/sort/sort_star'),
        meta: { title: '明星排序' }
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    redirect: 'noredirect',
    name: 'Member',
    meta: { title: '会员管理', icon: 'member' },
    children: [
      {
        path: 'member_list',
        name: 'MemberList',
        component: () => import('@/views/member/member_list'),
        meta: { title: '会员列表' }
      },
      {
        path: 'company_list',
        name: 'CompanyList',
        component: () => import('@/views/member/company_list'),
        meta: { title: '会员企业列表' }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/permission',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    meta: {
      title: '管理员设置',
      icon: 'lock',
      roles: ['AdminSuper', 'admin']
    },
    children: [
      {
        path: 'admin_list',
        name: 'AdminList',
        component: () => import('@/views/permission/admin_list'),
        meta: {
          title: '管理员列表',
          roles: ['AdminSuper']
        }
      },
      {
        path: 'admin_add',
        name: 'AdminAdd',
        component: () => import('@/views/permission/admin_add'),
        meta: {
          title: '添加管理员',
          roles: ['AdminSuper']
        },
        hidden: true
      },
      {
        path: 'admin_edit',
        name: 'AdminEdit',
        component: () => import('@/views/permission/admin_edit'),
        meta: {
          title: '管理员修改',
          roles: ['AdminSuper', 'admin']
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
