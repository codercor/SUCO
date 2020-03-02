export default {
    host:"http://localhost:85",
    routes:{
        user:{
            user:"/user/",
            login:`/user/login`,
            register:`/user/register`,
            getIdByUsername: `/user/getIdByUsername`
        },
        post:{
            post:'/post/',
            home:"/post/home/",
            like:"/post/like/",
            sendComment:"/post/sendComment/",
            deleteComment:"/post/deleteComment/"
        }
    }
 }