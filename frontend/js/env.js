export default {
    host:"http://localhost:85",
    routes:{
        user:{
            user:"/user/",
            login:`/user/login`,
            register:`/user/register`,
            getIdByUsername: `/user/getIdByUsername`,
            acceptFriendRequest: `/user/acceptFriendRequest/`,
            rejectFriendRequest: `/user/rejectFriendRequest/`,
            cancelFriendRequest:`/user/cancelFriendRequest/`,
            addFriend:`/user/addFriend/`,
            block:`/user/block/`,
            deleteFriend:`/user/deleteFriend/`,
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