import { createRouter, createWebHashHistory } from "vue-router";
const Login = () => import("../views/Login.vue");
const Drive = () => import("../views/Drive.vue");
const File = () => import("../components/File.vue");
const FileRecycle = () => import("../components/FileRecycle.vue");
const User = () => import("../views/User.vue");
const UserManagement = () => import("../components/ControllPanel/UserManagement.vue");
const StorageManagement = () => import("../components/ControllPanel/StorageManagement.vue");
const NotFound = () => import("../views/NotFound.vue");
const ControllPanel = () => import("../views/ControllPanel.vue");
const NotAuthorization = () => import("../views/NotAuthorization.vue");
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: "Drives",
      path: "/",
      component: Drive,
      meta: {
        requireAdminAuthorization: false
      },
      children: [
        {
          name: "Folder",
          path: "/folder",
          component: File,
          meta: {
            requireAdminAuthorization: false,
          },

        },
        {
          name: "FileRecycle",
          path: "/fileRecycle",
          component: FileRecycle,
          meta: {
            requireAdminAuthorization: false,
          },
        },
        {
          name: "Users",
          path: "/users",
          component: User,
          meta: {
            requireAdminAuthorization: false,
          },
        },
      ]
    },
    {
      name: "Login",
      path: "/login",
      component: Login,
      meta: {
        requireLogin: false,
        requireAdminAuthorization: false,
      },
    },
    {
      name: "ControllPanel",
      path: "/ControllPanel",
      component: ControllPanel,
      meta: {
        requireAdminAuthorization: true,
      },
      children: [
        {
          name: "UserManagement",
          path: "/ControllPanel/UserManagement",
          component: UserManagement,
          meta: {
            requireAdminAuthorization: true,
          },
        },
        {
          name: "StorageManagement",
          path: "/ControllPanel/StorageManagement",
          component: StorageManagement,
          meta: {
            requireAdminAuthorization: true,
          },
        }
      ]
    },
    //404页面
    // {
    //   name: "404",
    //   path: "/:catchAll(.*)",
    //   component: NotFound,
    //   meta: {
    //     requireAdminAuthorization: false,
    //   },
    // },
    //未授权页面
    {
      name: "NotAuthorization",
      path: "/NotAuthorization",
      component: NotAuthorization,
      meta: {
        requireAdminAuthorization: false,
      },
    }
  ],
});

//全局路由守卫
router.beforeEach((to, from, next) => {
  //登录鉴别
  const isLoginRoute = to.name == 'Login'
  const jwt = localStorage.getItem("Authorization");
  const requireAdminAuthorization = to.meta['requireAdminAuthorization']!
  const userData = localStorage.getItem("userData")
  //登录鉴权逻辑
  if (!isLoginRoute && !jwt) {
    next("/login");
  } else if (jwt) {
    //jwt有效期鉴别
    const [header, payload, signature] = jwt.split('.');
    const decodePayload = JSON.parse(atob(payload));
    const now = Date.now() / 1000;
    if (decodePayload.exp >= now) {
      //打开页面的时候会访问到"/folder"路由 但不携带参数 所以就默认携带root参数
      if (to.path == "/folder" && (Object.keys(to.query).length === 0)) {
        next({
          path: "/folder",
          query: {
            folderUUID: "root"
          }
        });
      }
      //前端后台系统鉴权
      if (requireAdminAuthorization) {
        //需要管理员权限
        if (userData) {
          //userData 不为null时
          const userDataJSON = JSON.parse(userData)
          const role = userDataJSON.role
          if (role == 'admin') {
            //当前用户是否是管理员
            //是就允许继续访问
            next()
          } else {
            //不是则跳转到未授权页面
            next('/NotAuthorization')
          }
        } else {
          //userData为null时 判断为未登录 跳转到登录页面
          next('/login')
        }
      } else {
        //不需要管理员权限则直接放行
        next()
      }
    } else {
      //当jwt过期的时候 移除本地存储的jwt并且跳转到登录页面
      localStorage.removeItem("Authorization");
      localStorage.removeItem("userData");
      next('/login')
    }
  } else {
    //当目标路由是登录路由时 且jwt为null时 放行
    next()
  }
});

export default router;
