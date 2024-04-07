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
import UserRegisterPage from "../pages/UserRegisterPage.vue";
import UserGenderEditPage from "../pages/UserGenderEditPage.vue";
import EditTagsPage from "../pages/EditTagsPage.vue";
import UserMorePage from "../pages/UserMorePage.vue";
import ShowUserDetail from "../pages/ShowUserDetail.vue";
import ShowTeamDetail from "../pages/ShowTeamDetail.vue";
import TeamMembersPage from "../pages/TeamMembersPage.vue";




//定义一些路由
const routes = [
    { path: '/user/login', title:'登录', component: UserLoginPage },
    { path: '/user/register', title:'注册', component: UserRegisterPage },
    { path: '/', redirect: '/user/login' },
    { path: '/index', title:'星球', component: Index },
    { path: '/user', title:'个人信息',  component: UserPage },
    { path: '/user/more', title:'个人信息',  component: UserMorePage },
    { path: '/search', title:'发现', component: searchPage },
    { path: '/user/list', title:'星友列表', component: searchResultPage },
    { path: '/user/edit', title:'编辑信息', component: UserEditPage },
    { path: '/user/edit/gender', title:'编辑信息', component: UserGenderEditPage },
    { path: '/user/tags', title:'编辑标签', component: EditTagsPage },
    { path: '/user/detail', title:'详情', component: ShowUserDetail },
    { path: '/user/team/join', title:'我加入星球', component: UserTeamJoinPage },
    { path: '/user/team/create', title:'我创建的星球', component: UserTeamCreatePage },

    { path: '/team', title:'寻找星球', component: TeamPage },
    { path: '/team/detail', title:'星球详情', component: ShowTeamDetail },
    { path: '/team/add', title:'创建星球', component: TeamAddPage },
    { path: '/team/update', title:'更新星球', component: TeamUpdatePage },
    { path: '/team/members', title:'星球成员', component: TeamMembersPage },

]

export default routes;