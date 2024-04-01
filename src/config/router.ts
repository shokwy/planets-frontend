import Index from "../pages/Index.vue";
import TeamPage from "../pages/TeamPage.vue";
import UserPage from "../pages/UserPage.vue";
import searchPage from "../pages/searchPage.vue";
import UserEditPage from "../pages/UserEditPage.vue";
import searchResultPage from "../pages/searchResultPage.vue";
import UserLoginPage from "../pages/UserLoginPage.vue";
import TeamAddPage from "../pages/TeamAddPage.vue";
import TeamUpdatePage from "../pages/TeamUpdatePage.vue";
import UserTeamJoinPage from "../pages/UserTeamJoinPage.vue";
import UserTeamCreatePage from "../pages/UserTeamCreatePage.vue";




//定义一些路由
const routes = [
    { path: '/', component: Index },
    { path: '/team', component: TeamPage },
    { path: '/user', component: UserPage },
    { path: '/search', component: searchPage },
    { path: '/user/list', component: searchResultPage },
    { path: '/user/edit', component: UserEditPage },
    { path: '/user/login', component: UserLoginPage },

    { path: '/team/add', component: TeamAddPage },
    { path: '/team/update', component: TeamUpdatePage },
    { path: '/user/team/join', component: UserTeamJoinPage },
    { path: '/user/team/create', component: UserTeamCreatePage },
]

export default routes;