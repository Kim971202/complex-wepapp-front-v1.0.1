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
    component: () => import("../views/LoginCopy.vue"),
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
    path: "/donghoInfo/donghoInfoList",
    name: "donghoInfoList",
    component: () => import("../views/donghoInfo/donghoInfoList.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/donghoInfo/donghoInfoUpdate",
    name: "donghoInfoUpdate",
    component: () => import("../views/donghoInfo/donghoInfoUpdate.vue"),
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

  {
    path: "/visitCar/visitCarList",
    name: "vistCarList",
    component: () => import("../views/visitCar/visitCarList.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/visitCar/visitCarListDetail",
    name: "vistCarListDetail",
    component: () => import("../views/visitCar/visitCarListDetail.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/visitCar/visitCarInsert",
    name: "visitCarInsert",
    component: () => import("../views/visitCar/visitCarInsert.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/visitCar/visitCarListUpdate",
    name: "visitCarListUpdate",
    component: () => import("../views/visitCar/visitCarListUpdate.vue"),
    meta: { requireLogin: true },
  },

  {
    path: "/contractDoc/contractDocList",
    name: "contractDocList",
    component: () => import("../views/contractDoc/contractDocList.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/contractDoc/contractDocListDetail",
    name: "contractDocDetail",
    component: () => import("../views/contractDoc/contractDocListDetail.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/contractDoc/contractDocUpdate",
    name: "contractDocUpdate",
    component: () => import("../views/contractDoc/contractDocUpdate.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/contractDoc/contractDocInsert",
    name: "contractDocInsert",
    component: () => import("../views/contractDoc/contractDocInsert.vue"),
    meta: { requireLogin: true },
  },

  // {
  //   path: "/notice/noticeList",
  //   name: "noticeList",
  //   component: () => import("../views/notice/noticeList.vue"),
  //   meta: { requireLogin: true },
  // },
  // {
  //   path: "/notice/noticeListDetail",
  //   name: "noticeListDetail",
  //   component: () => import("../views/notice/noticeListDetail.vue"),
  //   meta: { requireLogin: true },
  // },
  /************************************************************************************************************** */
  {
    path: "/ems/list",
    name: "emsList",
    component: () => import("../views/ems-view/emsList.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/ems/detail",
    name: "emsDetail",
    component: () => import("../views/ems-view/emsDetail.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/notice/list",
    name: "noticeList",
    component: () => import("../views/notice-view/noticeList.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/notice/detail",
    name: "noticeDetail",
    component: () => import("../views/notice-view/noticeDetail.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/notice/insert",
    name: "noticeInsert",
    component: () => import("../views/notice-view/noticeInsert.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/notice/update",
    name: "noticeUpdate",
    component: () => import("../views/notice-view/noticeUpdate.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/vote/list",
    name: "voteList",
    component: () => import("../views/vote-view/voteList.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/vote/detail",
    name: "voteDetail",
    component: () => import("../views/vote-view/voteDetail.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/vote/insert",
    name: "voteInsert",
    component: () => import("../views/vote-view/voteInsert.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/mngFee/list",
    name: "mngFeeList",
    component: () => import("../views/mngFee-view/mngFeeList.vue"),
    meta: { requireLogin: true },
  },
  {
    path: "/mngFee/detail",
    name: "mngFeeDetail",
    component: () => import("../views/mngFee-view/mngFeeDetail.vue"),
    meta: { requireLogin: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// //  to: ????????? URL??? ?????? ??????, from: ?????? URL??? ?????? ??????, next: ???????????? ?????? ?????????
// //  LoginStore??? isLogin() ???????????? ???????????? Login ????????? ????????????
// //  ???????????? ?????? ?????? ????????? Login Vue??? ???????????? ?????????. ??????????????? ????????? URL??? ??? ????????? ?????????
// //  to.path??? ???????????? ?????? URL??? Login??? ??????????????? ????????? ??? ??????
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

// //????????? ?????? ????????? ????????? URL??? ?????? ????????? to?????? meta ????????? requireLogin??? true?????? ???????????? Login Vue??? ???????????? ???
// //beforeEach() ??????????????? next() ???????????? ???????????? ????????? ????????? ???????????? ????????? ????????? next() ???????????? ??????????????? ???
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

//????????? ???????????? ?????? ???????????? ????????? matched ?????? ????????? ??????
//ome() ???????????? ????????? matched ????????? ?????? meta ????????? requireLogin??? true?????? ???????????? ???
//some() ???????????? ????????? ???????????? ????????? ????????? ???????????? ????????? true??? ??????
//some() ???????????? ??? ?????? ????????? matched ?????? ?????? ????????? route record(????????? ?????????)?????? ???(??? ???????????? ?????? ???????????? ????????? ???????????? ?????????)
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requireLogin)) {
    const isLogin = store.getters["loginStore/isLogin"];
    if (!isLogin) {
      var result = confirm(
        "?????????????????? ?????? ???????????????.\n????????? ???????????????????"
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
