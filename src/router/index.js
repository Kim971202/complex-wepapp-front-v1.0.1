import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import store from "../store";
//or import store from '@/store';

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  // {
  //   path: "/about",
  //   name: "about",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  // },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/board",
    name: "Nboard",
    component: () => import("../views/NBoard.vue"),
    meta: { requireLogin: true },
    children: [
      {
        path: "",
        name: "BoardList",
        component: () => import("../views/BoardList.vue"),
      },
      {
        path: "boardview",
        name: "BoardView",
        component: () => import("../views/BoardView.vue"),
      },
      {
        path: "boardwrite",
        name: "BoardWrite",
        component: () => import("../views/BoardWrite.vue"),
        //meta: { requireLogin: true },
      },
      {
        path: "boardedit",
        name: "BoardEdit",
        component: () => import("../views/BoardEdit.vue"),
        //meta: { requireLogin: true },
      },
    ],
  },
  // {
  //   path: "/score",
  //   name: "storeScore",
  //   component: () => import("../views/Score.vue"),
  //   meta: { requireLogin: true },
  // },
  {
    path: "/board/list",
    name: "sBoardList",
    component: () => import("../views/board/BoardList.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/board/detail",
    name: "sBoardDetail",
    component: () => import("../views/board/BoardDetail.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/board/update",
    name: "sBoardUpdate",
    component: () => import("../views/board/BoardUpdate.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/board/insert",
    name: "sBoardInsert",
    component: () => import("../views/board/BoardInsert.vue"),
    meta: { requireLogin: true },
  },

  /************************************************************************************************************** */
  {
    path: "/inoutCar/inoutCarList",
    name: "inoutCarList",
    component: () => import("../views/inoutCar/inoutCarList.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/elevator/elevatorLog",
    name: "elevatorLog",
    component: () => import("../views/elevator/elevatorLog.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/parking/parkingLocation",
    name: "parkingLocaton",
    component: () => import("../views/parking/parkingLocation.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/parking/parkingLocDetail",
    name: "parkingLocationDetail",
    component: () => import("../views/parking/parkingLocDetail.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/parcel/parcelList",
    name: "parcelList",
    component: () => import("../views/parcel/parcelList.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/parcel/parcelListDetail",
    name: "parcelListDetail",
    component: () => import("../views/parcel/parcelListDetail.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/parcel/parcelListUpdate",
    name: "parcelUpdate",
    component: () => import("../views/parcel/parcelListUpdate.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/parcel/parcelInsert",
    name: "parcelInsert",
    component: () => import("../views/parcel/parcelInsert.vue"),
    meta: { requireLogin: true },
  },

  {
    path: "/keyContract/keyContractList",
    name: "keyContractList",
    component: () => import("../views/keyContract/keyContractList.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/keyContract/keyContractUpdate",
    name: "keyContractUpdate",
    component: () => import("../views/keyContract/keyContractUpdate.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/keyContract/keyContractInsert",
    name: "keyContractInsert",
    component: () => import("../views/keyContract/keyContractInsert.vue"),
    meta: { requireLogin: true },
  },

  {
    path: "/complaint/complaintList",
    name: "complaintList",
    component: () => import("../views/complaint/complaintList.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/complaint/complaintListDetail",
    name: "complaintListDetail",
    component: () => import("../views/complaint/complaintListDetail.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/complaint/complaintListUpdate",
    name: "complaintListUpdate",
    component: () => import("../views/complaint/complaintListUpdate.vue"),
    meta: { requireLogin: true },
  },
  /************************************************************************************************************** */
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// //  to: 이동할 URL에 대한 객체, from: 현재 URL에 대한 객체, next: 이동하기 위한 메서드
// //  LoginStore의 isLogin() 메서드를 사용하여 Login 여부를 가져오고
// //  로그인이 되어 있지 않으면 Login Vue로 이동하게 합니다. 파라미터로 이동할 URL의 풀 경로를 전달함
// //  to.path를 제거하면 전체 URL에 Login이 처리되어야 이동할 수 있음
// router.beforeEach((to, from, next) => {
//   if (to.path == "/score") {
//     const isLogin = store.getters["loginStore/isLogin"];
//     if (!isLogin) {
//       next("/login?returnUrl=" + to.fullPath);
//       //next({path: '/login', query: { returnUrl: to.fullPath }});
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });

// //라우트 전역 처리로 이동할 URL에 대한 객체인 to에서 meta 필드에 requireLogin가 true인지 확인하여 Login Vue로 이동하게 함
// //beforeEach() 메서드에서 next() 메서드를 호출하지 않으면 이동이 중지되기 때문에 무조건 next() 메서드가 호출되어야 함
// router.beforeEach((to, from, next) => {
//   console.log(".................................................");
//   console.log(to);
//   if (to.meta.requireLogin) {
//     const isLogin = store.getters["loginStore/isLogin"];
//     if (!isLogin) {
//       next("/login?returnUrl=" + to.fullPath);
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });

//경로와 일치되는 모든 라우트의 정보가 matched 배열 객체로 적용
//ome() 메서드를 이용해 matched 배열에 있는 meta 필드에 requireLogin가 true인지 확인하면 됨
//some() 메서드는 배열을 순서대로 돌면서 조건이 하나라도 맞으면 true를 리턴
//some() 메서드의 첫 번째 인자는 matched 배열 안의 객체로 route record(라우트 레코드)라고 함(즉 상위부터 하위 라우트가 라우트 레코드로 전달됨)
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requireLogin)) {
    const isLogin = store.getters["loginStore/isLogin"];
    if (!isLogin) {
      var result = confirm(
        "로그인되어야 사용 가능합니다.\n로그인 하시겠습니까?"
      );
      if (result) {
        next({ name: "Login", query: { returnUrl: to.fullPath } });
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
