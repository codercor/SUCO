import env from '../env.js';
import Adapters from '../classes/Adapters.js';
import User from './User.js';
import { Services } from './Services.js';

export default class Dom {
    static standartRender(data) {
        let myNamePlace = Array.from(document.getElementsByClassName("my-user-name"));
        let myPhotoPlace = Array.from(document.getElementsByClassName("my-photo"));
        myNamePlace.forEach(el => {
            el.innerHTML = data.adSoyad;
        });
        myPhotoPlace.forEach(el => {
            el.src = env.host + data.profilResmi;
        });
    }
    static setHomeEvents() {
        let commentForms = Array.from(document.getElementsByClassName("comment-form"));
        let likeButtons = Array.from(document.getElementsByClassName("like-button"));

        likeButtons.forEach(el => {
            el.addEventListener("click", async (e) => {
                let postId = e.target.getAttribute("postId");
                this.updatePostCounters(postId);
            });
        });

        commentForms.forEach(el => {
            el.addEventListener("keydown",async (e) => {
                if (e.key == "Enter") {
                    let postId = e.target.getAttribute("postId");
                    let comment = e.target.value;
                    if(comment == "") return;
                    await Services.postJson(env.routes.post.sendComment + postId,{comment});
                    this.updatePostCounters(postId);
                    this.updatePostComments(postId);
                    e.target.value = "";
                }
            });
        });
    }
    static async updatePostComments(postId){
       
       let thisPost = (await Services.getPostData(postId))[0];
       let thisComments = document.querySelector(`div[postcommentsbyid="${postId}"]`);
       thisComments.innerHTML = await this.commentRender(thisPost.yorumlar);
       
       
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

        await user.init(username);
        let header = `<div class="card card-widget offset-md-2 col-md-8">
        <div class="card-header">
            <div class="user-block">
                <img class="img-circle" src="${env.host + user.data.profilResmi}" alt="User Image">
                <span class="username"><a href="#">${user.data.adSoyad}</a></span>
                <span class="description" >${ (function () { if (postData.gizlilik == 1) return "Arkadaşlar"; else return "Herkese Açık"; })()} - ${postData.tarih}</span>
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
        <button type="button" postId="${postData.id}" class="btn btn-default btn-sm"><i class="fas fa-share"></i>Paylaş</button>
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
            <button type="button" postId="${postData.id}" class="btn btn-default btn-sm"><i class="fas fa-share"></i>
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
                <button type="button" postId="${postData.id}" class="btn btn-default btn-sm"><i class="fas fa-share"></i>Paylaş</button>
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
}