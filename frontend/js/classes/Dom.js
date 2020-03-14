import env from '../env.js';
import Adapters from '../classes/Adapters.js';
import User from './User.js';
import { Services } from './Services.js';

export default class Dom {
    static async standartRender(data) {
        let myNamePlace = Array.from(document.getElementsByClassName("my-user-name"));
        let myPhotoPlace = Array.from(document.getElementsByClassName("my-photo"));
        myNamePlace.forEach(el => {
            el.innerHTML = `<a href="/frontend/profile.html?user=${data.kullaniciAdi}">` + data.adSoyad + '</a>';
        });
        myPhotoPlace.forEach(el => {
            let parent = el.parentElement;
            parent.innerHTML = "";
            parent.innerHTML += `<a href="/frontend/profile.html?user=${data.kullaniciAdi}">  <img src="${env.host + data.profilResmi}" class="img-circle my-photo" style="height: 30px;"
            alt="User Image">`+ '</a>';
        });
        await this.initFriendRequestsButton(data);
    }
    static loading(status) {
        let postsPlace = document.getElementById("postsPlace");
        let loadingBox = document.getElementById("loading");
        if (status == true) {
            loadingBox.style.display = "block";
            postsPlace.style.display = "none";
        } else {
            loadingBox.style.display = "none";
            postsPlace.style.display = "block";
        }
    }
    static async setHomeEvents() {
        let commentForms = Array.from(document.getElementsByClassName("comment-form"));
        let likeButtons = Array.from(document.getElementsByClassName("like-button"));
        let commentDeleteButtons = Array.from(document.getElementsByClassName("commentDelete"));
        let shareButtons = Array.from(document.getElementsByClassName("share-button"));

        for (let i = 0; i < likeButtons.length; i++) {
            likeButtons[i].addEventListener("click", async (e) => {
                let postId = e.target.getAttribute("postId");
                this.updatePostCounters(postId);
            });
        }

        for (let i = 0; i < commentForms.length; i++) {
            commentForms[i].addEventListener("keydown", async (e) => {
                if (e.key == "Enter") {
                    let postId = e.target.getAttribute("postId");
                    let comment = e.target.value;
                    this.commentLoading(true, postId);
                    if (comment == "") return;
                    await Services.postJson(env.routes.post.sendComment + postId, { comment });
                    this.updatePostCounters(postId);
                    this.updatePostComments(postId);
                    e.target.value = "";
                }
            });
        }
        for (let i = 0; i < commentDeleteButtons.length; i++) {
            commentDeleteButtons[i].addEventListener("click", async (e) => {

                let buton = e.target.parentElement,
                    myId = buton.getAttribute("myid"),
                    comment = buton.getAttribute("comment"),
                    postId = buton.parentElement.parentElement.getAttribute("postcommentsbyid");
                this.commentLoading(true, postId);
                await Services.postJson(env.routes.post.deleteComment + postId, { commentData: { myId, comment } });
                this.updatePostComments(postId);
                this.updatePostCounters(postId);
            });
        }
        for (let i = 0; i < shareButtons.length; i++) {
            shareButtons[i].addEventListener("click", (e) => {
                let postId = e.target.getAttribute("postid");
                this.shareModalInit(postId);
            });
        }

    }
    static shareModalInit(postId) {
        let facebokButton = document.getElementById("fb-sh"),
            twitterButton = document.getElementById("tw-sh"),
            whatsappButton = document.getElementById("wa-sh"),
            copyButton = document.getElementById("cp-sh");
        facebokButton.href = `https://www.facebook.com/sharer/sharer.php?u=${location.host}/frontend/post.html?postId=${postId}`;
        twitterButton.href = `https://twitter.com/intent/tweet?original_referer=${location.host}/frontend/post.html?postId=${postId}&ref_src=twsrc%5Etfw&url=http://localhost:85/post.html?postId=${postId}`;
        whatsappButton.href = `whatsapp://send?text=${location.host}/frontend/post.html?postId=${postId}`;
        copyButton.setAttribute("url", `${location.host}/frontend/post.html?postId=${postId}`);
        copyButton.addEventListener("click", () => {
            let alan = copyButton.getAttribute("url");
            let textAlani = document.createElement('TEXTAREA');
            textAlani.value = alan;
            document.body.appendChild(textAlani);
            textAlani.select();
            document.execCommand('copy');
            textAlani.style.display = 'none';
        });
    }

    static async updatePostComments(postId) {
        let thisPost = (await Services.getPostData(postId))[0];
        let thisComments = document.querySelector(`div[postcommentsbyid="${postId}"]`);
        thisComments.innerHTML = await this.commentRender(thisPost.yorumlar);
        await this.setHomeEvents();
        this.commentLoading(false, postId);
    }
    static commentLoading(status, postId) {
        let commentLoadingBoxes = document.querySelector(`.commentLoading,div[postId="${postId}"]`);
        if (status) {
            commentLoadingBoxes.style.display = "block";
            return;
        }
        commentLoadingBoxes.style.display = "none";
    }
    static async updatePostCounters(postId) {
        await Services.postJson(env.routes.post.like + postId);
        let thisPost = await Services.getPostData(postId);
        let liveLikeCounter = (eval(thisPost[0].begenenler)).length;
        let liveCommentCounter = (eval(thisPost[0].yorumlar)).length;
        let postDom = document.querySelector(`span[counterforbyid="${postId}"]`)
        postDom.innerHTML = `${liveLikeCounter} Suco - ${liveCommentCounter} Yorum`;
    }
    static async postRender(postData) {
        let postsPlace = document.getElementById("postsPlace");
        postData.resim = Adapters.postImageAdapter(postData.resim);
        let user = new User();
        let username = (await User.getUserNameById(postData.paylasanId)).username;
        let duygu = (function () {
            switch (postData.duygu) {
                case ("0"): return "Mutlu 😊";
                case ("1"): return "Mutsuz ☹";

                case ("2"): return "Endişeli😟";
                case ("3"): return "Çılgın 🤪";

                case ("4"): return "Hasta 🤢";

                case ("5"): return "Gülmekten Kırılmış 🤣";

                case ("6"): return "Sinirli 😡";

                case ("7"): return "Keyfi Yerinde 🤗";
            }
        })();
        await user.init(username);
        let header = `<div class="card card-widget offset-md-2 col-md-8">
        <div class="card-header">
            <div class="user-block">
            <a href="/frontend/profile.html?user=${username}">
                <img class="img-circle" src="${env.host + user.data.profilResmi}" alt="User Image"> </a>
                <span class="username"><a href="/frontend/profile.html?user=${username}">${user.data.adSoyad}</a></span>
                <span class="description" ><a style="color:black" href="post.html?postId=${postData.id}"> ${(function () { if (postData.gizlilik == 1) return "Arkadaşlar"; else return "Herkese Açık"; })()} - ${postData.tarih} </a> | ${(function () { if (duygu == undefined) return ""; else return `<span class="badge badge-primary" style="font-size:0.8rem"> ${duygu} <span>` })()} </span>
            </div>
            <!-- /.user-block -->
            <div class="card-tools">
                <button type="button" class="btn btn-tool" data-toggle="tooltip" title="Mark as read">
                    <i class="far fa-circle"></i></button>
                <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i>
                </button>
                <button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times"></i>
                </button>
            </div>
            <!-- /.card-tools -->
        </div>
        <!-- /.card-header -->`;
        let footer = `<div class="card-footer card-comments" postCommentsById="${postData.id}" style="display: block;">
        ${await Dom.commentRender(postData.yorumlar)}
        </div>
        <!-- /.card-footer -->
        <div class="card-footer" style="display: block;">
        <div id="loading" class="col-12 text-center">
              <div class="mb-2" style="display:none" postId="${postData.id}" class="commentLoading">  
                    <div class="spinner-border" style="width: 1rem; height: 1rem;" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <strong>Yükleniyor...</strong>  
                    </div>
                </div>
                <img class="img-fluid img-circle img-sm" src="${env.host + user.data.profilResmi}" alt="Alt Text">
                <!-- .img-push is used to add margin to elements next to floating images -->
                       
                <div class="img-push">
                    <input type="text" postId = ${postData.id} class="form-control form-control-sm comment-form" placeholder="Yorum bırak...">
                </div>
        </div>
        <!-- /.card-footer --></div>`;
        if (postData.resim.length == 0) {
            let noImagePostTemp = `
    <div class="card-body" style="display: block;">
        <p>${postData.metin}</p>
        <button type="button" postId="${postData.id}" data-toggle="modal" data-target="#share-modal" class="btn btn-default btn-sm share-button"><i class="fas fa-share"></i>Paylaş</button>
        <button type="button" postId="${postData.id}" class="btn btn-default btn-sm like-button"><i class="fas fa-heart"></i>Suco</button>
        <span class="float-right text-muted" counterForById="${postData.id}">${eval(postData.begenenler).length} Suco - ${eval(postData.yorumlar).length} Yorum</span>
    </div>
    <!-- /.card-body -->
`;
            postsPlace.innerHTML += header + noImagePostTemp + footer;
        }
        if (postData.resim.length == 1) {
            let singleImagePostTemp = `
        <div class="card-body" style="display: block;">
            <img class="img-fluid pad" src="${ env.host + '/postImages/' + postData.resim[0]}" alt="Photo">

            <p>${postData.metin}</p>
            <button type="button" postId="${postData.id}" data-toggle="modal" data-target="#share-modal" class="btn btn-default btn-sm share-button"><i class="fas fa-share"></i>
                Paylaş</button>
            <button type="button" postId="${postData.id}" class="btn btn-default btn-sm like-button"><i class="fas fa-heart"></i>
                Suco</button>
            <span class="float-right text-muted" counterForById="${postData.id}">${eval(postData.begenenler).length} Suco - ${eval(postData.yorumlar).length} Yorum</span>
        </div>
        <!-- /.card-body -->
        
    `;
            postsPlace.innerHTML += header + singleImagePostTemp + footer;
        }
        if (postData.resim.length > 1) {
            let multiImagePostTemp = `
            <div class="card-body" style="display: block;">
               
                        <div class="row">
                            ${this.multiImagePostRender(postData.resim)}
                        </div>
    
                <p>${postData.metin}</p>
                <button type="button" postId="${postData.id}" data-toggle="modal" data-target="#share-modal" class="btn btn-default btn-sm share-button"><i class="fas fa-share"></i>Paylaş</button>
                <button type="button" postId="${postData.id}" class="btn btn-default btn-sm like-button"><i class="fas fa-heart"></i>Suco</button>

                <span class="float-right text-muted" counterForById="${postData.id}">${eval(postData.begenenler).length} Suco - ${eval(postData.yorumlar).length} Yorum</span>
            </div>
            <!-- /.card-body -->
            
        `;
            postsPlace.innerHTML += header + multiImagePostTemp + footer;
        }
    }
    static async commentRender(commentData) {
        let commentsResult = "";
        commentData = eval(commentData);
        await new Promise(async (resolve, reject) => {
            for (let i = 0; i < commentData.length; i++) {
                let user = new User();
                user.username = (await User.getUserNameById(commentData[i].myId)).username;
                await user.init(user.username)
                //console.log(commentData[i]);
                //console.log(user);
                commentsResult += `  <div class="card-comment">
                <!-- User image -->
                <img class="img-circle img-sm" src="${env.host + user.data.profilResmi}" alt="User Image">
                <button type="button" myId="${commentData[i].myId}" comment="${commentData[i].comment}" ${(function () { if (user.username != localStorage.getItem("username")) return 'style="display:none"'; else return ""; })()} class="close commentDelete" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
                <div class="comment-text">
                    <span class="username">
                        ${user.data.adSoyad}
                        <span class="text-muted float-right"></span>
                    </span><!-- /.username -->
                    ${commentData[i].comment}
                </div>
                <!-- /.comment-text -->
               
            </div> `;
            }
            resolve();
        });
        return commentsResult;
    }
    static multiImagePostRender(imageArray) {
        let result = "";
        if (imageArray.length >= 4) {
            if (imageArray.length % 4 == 0) {
                for (let i = 0; i < imageArray.length; i++) {
                    result += `<div class="col-md-3">
                <a href="${ env.host + '/postImages/' + imageArray[i]}" data-toggle="lightbox" data-title="SUCO" data-gallery="gallery">
               <img src="${ env.host + '/postImages/' + imageArray[i]}" style="height:140px" class="img-fluid mb-2" alt="white sample">
            </a>
             </div>`
                }
            }
            if (imageArray.length % 4 != 0) {
                let k = imageArray.length % 4;
                for (let i = 0; i < imageArray.length - k; i++) {
                    result += `<div class="col-md-3">
                <a href="${ env.host + '/postImages/' + imageArray[i]}" data-toggle="lightbox" data-title="SUCO" data-gallery="gallery">
               <img src="${ env.host + '/postImages/' + imageArray[i]}" style="height:140px" class="img-fluid mb-2" alt="white sample">
                </a>
                 </div>`}
                for (let i = 0; i < k; i++) {
                    if (k == 1) {
                        result += `<div class="col-md-12 text-center">
                 <a href="${ env.host + '/postImages/' + imageArray[imageArray.length - k + i]}" data-toggle="lightbox" data-title="SUCO" data-gallery="gallery">
                 <img src="${ env.host + '/postImages/' + imageArray[imageArray.length - k + i]}" style="height:250px" class="img-fluid mb-2" alt="white sample">
                 </a>
                 </div>`;
                    }
                    if (k == 2) {
                        result += `<div class="col-md-6">
                 <a href="${ env.host + '/postImages/' + imageArray[imageArray.length - k + i]}" data-toggle="lightbox" data-title="SUCO" data-gallery="gallery">
                 <img src="${ env.host + '/postImages/' + imageArray[imageArray.length - k + i]}" style="height:200px" class="img-fluid mb-2" alt="white sample">
                 </a>
                 </div>`;
                    }
                    if (k == 3) {
                        result += `<div class="col-md-4">
                 <a href="${ env.host + '/postImages/' + imageArray[imageArray.length - k + i]}" data-toggle="lightbox" data-title="SUCO" data-gallery="gallery">
                 <img src="${ env.host + '/postImages/' + imageArray[imageArray.length - k + i]}" style="height:160px" class="img-fluid mb-2" alt="white sample">
                 </a>
                 </div>`;
                    }
                }
            }
        } else {
            if (imageArray.length == 2) {
                for (let i = 0; i < imageArray.length; i++) {
                    result += `<div class="col-md-6">
                    <a href="${ env.host + '/postImages/' + imageArray[i]}" data-toggle="lightbox" data-title="SUCO" data-gallery="gallery">
                    <img src="${ env.host + '/postImages/' + imageArray[i]}" style="height:200px" class="img-fluid mb-2" alt="white sample">
                    </a>
                    </div>`;
                }

            }
            if (imageArray.length == 3) {
                for (let i = 0; i < imageArray.length; i++) {
                    result += `<div class="col-md-4">
                    <a href="${ env.host + '/postImages/' + imageArray[i]}" data-toggle="lightbox" data-title="SUCO" data-gallery="gallery">
                    <img src="${ env.host + '/postImages/' + imageArray[i]}" style="height:160px" class="img-fluid mb-2" alt="white sample">
                    </a>
                    </div>`;
                }

            }
        }


        return result;
    }
    static async profileRender(userData) {
        let firstNamePlace = document.getElementById("firstName"),
            lastNamePlace = document.getElementById("lastName"),
            ppPlace = document.getElementById("pp"),
            cpPlace = document.getElementById("cp"),
            postCounterPlace = document.getElementById("postCounter"),
            friendCounter = document.getElementById("friendCounter");

        [firstNamePlace, lastNamePlace, postCounterPlace, friendCounter].forEach((el) => {
            el.innerHTML = "";
        });

        let firstName = userData.adSoyad.split(" ")[0],
            lastName = userData.adSoyad.split(" ")[1];

        firstNamePlace.innerHTML = firstName;
        lastNamePlace.innerHTML = lastName;
        ppPlace.src = env.host + userData.profilResmi;
        cpPlace.style = `background: url('${(env.host + userData.kapakResmi)}');background-size: cover;`;
        postCounterPlace.innerHTML = userData.posts.length;
        friendCounter.innerHTML = (eval(userData.arkadaslar)).length;
        this.profileInfoRender(userData.kisiselBilgi);
        await this.profileFriendButtonsRender(userData);
    }
    static async profileFriendButtonsRender(data) {
        let friendButtonPlace = document.getElementById("friendButtonPlace");
        let myId = (await User.getUserData(localStorage.getItem("username"))).id;
        let userFriends = JSON.parse(data.arkadaslar);
        let userFriendRequest = JSON.parse(data.istekler);

        userFriendRequest.gelen = eval(userFriendRequest.gelen);
        userFriendRequest.gonderilen = eval(userFriendRequest.gonderilen);

        console.log(userFriendRequest);
        // Bu Kişi arkadaşım mı ? 
        if (userFriends.includes(myId)) {
            friendButtonPlace.innerHTML = `<button type="button" id="deleteFriendButton" class="btn btn-block btn-outline-success">Arkadaşlıktan Çıkar</button>
            <button type="button" id="blockButton" class="btn btn-block btn-outline-success">Engelle</button>`;
            let deleteFriendButton = document.getElementById("deleteFriendButton");
            let blockButton = document.getElementById("blockButton");
            deleteFriendButton.addEventListener("click", async () => {
                let status = await Services.postJson(env.routes.user.deleteFriend + data.kullaniciAdi);
                this.showToast("Arkadaşlıktan çıkartıldı.", "success");
                this.profileRender((await User.getUserData(data.kullaniciAdi)));
            });
            blockButton.addEventListener("click", async () => {
                let status = await Services.postJson(env.routes.user.block + data.kullaniciAdi);
                this.showToast("Kişi Engellendi !", "warning");
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            });
        } else
            // Bu kişi bana istek göndermiş mi ?
            if (userFriendRequest.gonderilen.includes(myId)) {
                console.log("İstek gelmiş");
                friendButtonPlace.innerHTML = ` <button type="button" id="acceptButton" class="btn btn-block btn-outline-success">İsteği Onayla</button>
            <button type="button" id="rejectButton" class="btn btn-block btn-outline-danger">Reddet</button>`;
                let acceptButton = document.getElementById("acceptButton");
                let rejectButton = document.getElementById("rejectButton");
                acceptButton.addEventListener("click", async () => {
                    let status = await Services.postJson(env.routes.user.acceptFriendRequest + data.kullaniciAdi);
                    this.showToast("Artık Arkadaşsınız", "success");
                    this.profileRender((await User.getUserData(data.kullaniciAdi)));
                });
                rejectButton.addEventListener("click", async () => {
                    let status = await Services.postJson(env.routes.user.rejectFriendRequest + data.kullaniciAdi);
                    this.showToast("Arkadaşlık isteği reddedildi.", "warning");
                    this.profileRender((await User.getUserData(data.kullaniciAdi)));
                });
            } else
                // Ben bu kişiye istek göndermiş miyim ?
                if (userFriendRequest.gelen.includes(myId)) {
                    console.log("Bu kişiden bana istek gelmiş");
                    friendButtonPlace.innerHTML = `<button type="button" id="cancelRequestButton" class="btn btn-block btn-outline-primary">İstekten Vazgeç</button>`;
                    let cancelRequestButton = document.getElementById("cancelRequestButton");
                    cancelRequestButton.addEventListener("click", async () => {
                        let status = await Services.postJson(env.routes.user.cancelFriendRequest + data.kullaniciAdi);
                        this.showToast("İstekten Vazgeçildi.", "success");
                        this.profileRender((await User.getUserData(data.kullaniciAdi)));
                    });
                } else if (data.id == myId) {
                    console.log("Kendi Profilin");
                    friendButtonPlace.innerHTML = `<button type="button" id="friendsButton" class="btn btn-block btn-outline-primary" data-toggle="modal" data-target="#friendsModal">Arkadaşlar</button>`;
                    this.friendsRender(data.kullaniciAdi);
                }
                else
                    // Eğer arkadaşımız değilse ve istek durumu yoksa
                    if (!userFriends.includes(myId) && !userFriendRequest.gelen.includes(myId) && !userFriendRequest.gonderilen.includes(myId)) {
                        console.log("Bu kişi arkadaşın değil");
                        friendButtonPlace.innerHTML = `<button type="button" id="sendFriendRequestButton" class="btn btn-block btn-outline-primary">Arkadaş Ol</button>
            <button type="button" id="blockButton" class="btn btn-block btn-outline-success">Engelle</button>`;
                        let sendFriendRequestButton = document.getElementById("sendFriendRequestButton");
                        let blockButton = document.getElementById("blockButton");
                        sendFriendRequestButton.addEventListener("click", async () => {
                            let status = await Services.postJson(env.routes.user.addFriend + data.kullaniciAdi);
                            this.showToast("Arkadaşlık isteği gönderildi.", "success");
                            this.profileRender((await User.getUserData(data.kullaniciAdi)));
                        });
                        blockButton.addEventListener("click", async () => {
                            let status = await Services.postJson(env.routes.user.block + data.kullaniciAdi);
                            this.showToast("Kişi Engellendi !", "warning");
                            setTimeout(() => {
                                window.location.reload();
                            }, 2000);
                        });
                    }
    }
    static async initFriendRequestsButton(data) {
        let friendRequestsButton = document.getElementById("friendRequestsButton");
        friendRequestsButton.innerHTML = "";
        let myUsername = data.kullaniciAdi;
        data = JSON.parse(data.istekler);

        let requestCounter = data.length;
        data = JSON.parse(data.gelen);
 
       
        
        let requestsHTML = "";
        for (let i = 0; i < data.length; i++) {
            let username = (await User.getUserNameById(data[i])).username;
            let userData = await User.getUserData(username);
            requestsHTML += `<div class="my-2 mx-1" >
            <a href="/frontend/profile.html?user=${username}" class="dropdown-item d-inline"> <img src="${env.host + '/' + userData.profilResmi}"
                    style="width: 30px; height: 30px;" class="img-circle elevation-2" alt="User Image">
                <span class="d-inline ml-1"> ${userData.adSoyad} </span></a>
                <div class="d-inline ml-1">
                    <button class="btn btn-xs btn-success navbarFriendRequestAcceptButton" username="${username}">Onayla</button>
                    <button class="btn btn-xs btn-danger navbarFriendRequestRejectButton" username="${username}"> Reddet</button>
                </div>
            
        </div>`
        }
        let template= `` 
        if(data.length == 0){
            template = `<a class="nav-link" data-toggle="dropdown" href="#">
            <i class="fas fa-user-friends"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right pb-3">
                <span class="dropdown-item dropdown-header">Arkadaşlık isteği yok.</span>
                <div class="dropdown-divider"></div>
            </div>`;
        }else{
           template = `<a class="nav-link" data-toggle="dropdown" href="#">
            <i class="fas fa-user-friends"></i>
            <span class="badge badge-primary navbar-badge">${data.length}</span>
    
            </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right pb-3">
                <span class="dropdown-item dropdown-header">${data.length} Yeni Arkadaşlık İsteği</span>
                <div class="dropdown-divider"></div>
                ${requestsHTML}   
            </div>`;  
        }
        friendRequestsButton.innerHTML += template;
        let acceptButtons = document.getElementsByClassName("navbarFriendRequestAcceptButton");
        let rejectButtons = document.getElementsByClassName("navbarFriendRequestRejectButton");
        for (let i = 0; i < acceptButtons.length; i++) {
            acceptButtons[i].addEventListener("click", async (e)=>{
                let status = await Services.postJson(env.routes.user.acceptFriendRequest + e.target.getAttribute("username"));
                this.showToast("Artık Arkadaşsınız", "success");
                await this.initFriendRequestsButton( await User.getUserData(myUsername));
            });
        }
    }
    static showToast(body, bgcolor) { // showToast("arkadaş olarak eklendi","bg-success");
        let myToast = document.getElementsByClassName("myToast")[0];
        myToast.style.display = "block";
        let icon,
            ToastBody = document.getElementById("toast-body");

        if (bgcolor == "success") icon = "check";
        if (bgcolor == "warning") icon = "exclamation-triangle";
        if (bgcolor == "danger") icon = "ban";

        let content = `   <div class="alert alert-${bgcolor} alert-dismissible">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
        <h5><i class="icon fas fa-${icon}"></i> Tamam !</h5>
        ${body}
       </div>`;
        ToastBody.innerHTML = content;
        setTimeout(() => {
            myToast.style.display = "none";
            ToastBody.innerHTML = "";
        }, 3000)
    }
    static profileInfoRender(info) {
        info = JSON.parse(info);
        let infoPlace = document.getElementById("personelInfo");
        let birthdayIcon = `fas fa-birthday-cake`,
            cityIcon = `fas fa-street-view`,
            jobIcon = `fas fa-briefcase`;

        infoPlace.innerHTML = "";
        Object.keys(info).forEach((el) => {
            if (el == "memleket") {
                infoPlace.innerHTML += `
                <li class="nav-item">
                  <a  class="nav-link">
                    <i class="${cityIcon} mr-2"></i> Memleket <span class="float-right badge">${info.memleket.toUpperCase()} </span>
                  </a>
                </li>`
            }
            if (el == "meslek") {
                infoPlace.innerHTML += `
                <li class="nav-item">
                  <a  class="nav-link">
                    <i class="${jobIcon} mr-2"></i> Meslek <span class="float-right badge">${info.meslek.toUpperCase()} </span>
                  </a>
                </li>`
            };
            if (el == "dogum") {
                infoPlace.innerHTML += `
                <li class="nav-item">
                  <a  class="nav-link">
                    <i class="${birthdayIcon} mr-2"></i> Doğum Tarihi <span class="float-right badge">${info.dogum.toUpperCase()} </span>
                  </a>
                </li>`
            };
        });


    }
    static async friendsRender(username) {
        let friendsIds = eval(((await User.getUserData(username)).arkadaslar));
        let friendsListPlace = document.getElementById("friendsListPlace"),
            friendsUserNames = [],
            friends = [];
        for (let i = 0; i < friendsIds.length; i++) {
            friendsUserNames.push((await User.getUserNameById(friendsIds[i])).username);
        }
        for (let i = 0; i < friendsIds.length; i++) {
            friends.push(await User.getUserData(friendsUserNames[i]));
        }
        friendsListPlace.innerHTML = "";
        for (let i = 0; i < friends.length; i++) {
            friendsListPlace.innerHTML += `<li class="list-group-item row">
               <div class="row">
                   <div class="col-2 ">
                      <a href="/frontend/profile.html?user=${friendsUserNames[i]}"> <img src="${env.host + '/' + friends[i].profilResmi}" class="img-circle" style="height: 30px;"
                           alt="User Image"> </a>
                   </div>
                   <div class="col-4">
                   <a href="/frontend/profile.html?user=${friendsUserNames[i]}">  <i> ${friends[i].adSoyad} </i></a>
                   </div>
                   <div class="col-4 offset-2">
                       <button class="btn btn-sm btn-primary friendsDeleteButtons" username="${friendsUserNames[i]}"> Arkadaşlardan Sil </button>
                   </div>
               </div>
           </li>`;
        }
        let friendsDeleteButtons = document.getElementsByClassName("friendsDeleteButtons");
        for (let i = 0; i < friendsDeleteButtons.length; i++) {
            friendsDeleteButtons[i].addEventListener("click", async (e) => {
                let status = await Services.postJson(env.routes.user.deleteFriend + e.target.getAttribute("username"));
                this.profileRender((await User.getUserData(username)))
                this.friendsRender(username);
            });
        }

    }
}