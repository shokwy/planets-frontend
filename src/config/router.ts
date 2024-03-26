import Index from "../pages/Index.vue";
import TeamPage from "../pages/TeamPage.vue";
import UserPage from "../pages/UserPage.vue";
import searchPage from "../pages/searchPage.vue";
import UserEditPage from "../pages/UserEditPage.vue";




//定义一些路由
const routes = [
    { path: '/', component: Index },
    { path: '/team', component: TeamPage },
    { path: '/user', component: UserPage },
    { path: '/search', component: searchPage },
    { path: '/user/edit', component: UserEditPage },
]

export default routes;