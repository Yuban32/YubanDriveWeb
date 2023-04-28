import { createRouter, createWebHashHistory } from "vue-router";
const Login = () => import("../views/Login.vue");
const Drive = () => import("../views/Drive.vue");
const File = () => import("../components/File.vue");
const FileRecycle = () => import("../components/FileRecycle.vue")
const User = () => import("../views/User.vue")
const ModifyUserInfo = () => import("../views/ModifyUserInfo.vue")
const UserManagement = () => import("../views/UserManagement.vue")
const NotFound = () => import("../views/NotFound.vue")
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: "Drives",
      path: "/",
      component: Drive,
      meta: {
        requireLogin: true,
        requireAdminAuthorization: false
      },
      children: [
        {
          name: "Folder",
          path: "/folder",
          component: File

        },
        {
          name: "FileRecycle",
          path: "/fileRecycle",
          component: FileRecycle
        },
        {
          name: "Users",
          path: "/users",
          component: User
        },
        {
          name: "ModifyUserInfo",
          path: "/users/modify",
          component: ModifyUserInfo
        },
        {
          name: "UserManagement",
          path: "/management",
          component: UserManagement
        }
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
    //404页面
    {
      name: "404",
      path: "/:catchAll(.*)",
      component: NotFound
    }
  ],
});

//全局路由守卫
router.beforeEach((to, from, next) => {
  //登录鉴别
  const isLoginRoute = to.name == 'Login'
  const jwt = localStorage.getItem("Authorization");


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
      next();
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
