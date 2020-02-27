import env from '../env.js';
import Adapters from '../classes/Adapters.js';
import User from './User.js';

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
    static setHomeEvents(){
        let commentForms = Array.from(document.getElementsByClassName("comment-form"));
        console.log(commentForms);
        
        commentForms.forEach(el=>{
            el.addEventListener("keydown",(e)=>{
               alert("dada")
               //Burada Kaldık....
            });
        });
    }
    static async postRender(postData) {
        let postsPlace = document.getElementById("postsPlace");
        postData.resim = Adapters.postImageAdapter(postData.resim);
        let user = new User();
        let username = (await User.getUserNameById(postData.paylasanId)).username;
        await user.init(username);
        if (postData.resim.length == 0) {
            let noImagePostTemp = `<div class="card card-widget offset-md-2 col-md-8">
    <div class="card-header">
        <div class="user-block">
            <img class="img-circle" src="${env.host + user.data.profilResmi}" alt="User Image">
            <span class="username"><a href="#">${user.data.adSoyad}</a></span>
            <span class="description">${ (function () { if (postData.gizlilik == 1) return "Arkadaşlar"; else return "Herkese Açık"; })()} - ${postData.tarih}</span>
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
    <!-- /.card-header -->
    <div class="card-body" style="display: block;">

        <p>${postData.metin}</p>
        <button type="button" class="btn btn-default btn-sm"><i class="fas fa-share"></i>
            Paylaş</button>
        <button type="button" class="btn btn-default btn-sm"><i class="fas fa-heart"></i>
            Suco</button>
        <span class="float-right text-muted">${ eval(postData.begenenler).length} Suco - ${eval(postData.yorumlar).length} Yorum</span>
    </div>
    <!-- /.card-body -->
  <div class="card-footer card-comments" style="display: block;">
            
  ${await Dom.commentRender(postData.yorumlar)}
            
    </div>
    <!-- /.card-footer -->
    <div class="card-footer" style="display: block;">
            <img class="img-fluid img-circle img-sm" src="dist/img/user4-128x128.jpg" alt="Alt Text">
            <!-- .img-push is used to add margin to elements next to floating images -->
            <div class="img-push">
                <input type="text" class="form-control form-control-sm comment-form" placeholder="Yorum bırak...">
            </div>
    </div>
    <!-- /.card-footer -->
</div>`;
            postsPlace.innerHTML += noImagePostTemp;
        }
      if(postData.resim.length == 1){
        let singleImagePostTemp = `<div class="card card-widget offset-md-2 col-md-8">
        <div class="card-header">
            <div class="user-block">
                <img class="img-circle" src="${env.host + user.data.profilResmi}" alt="User Image">
                <span class="username"><a href="#">${user.data.adSoyad}</a></span>
                <span class="description">${ (function () { if (postData.gizlilik == 1) return "Arkadaşlar"; else return "Herkese Açık"; })()} - ${postData.tarih}</span>
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
        <!-- /.card-header -->
        <div class="card-body" style="display: block;">
            <img class="img-fluid pad" src="${ env.host +'/postImages/'+ postData.resim[0]}" alt="Photo">

            <p>${postData.metin}</p>
            <button type="button" class="btn btn-default btn-sm"><i class="fas fa-share"></i>
                Paylaş</button>
            <button type="button" class="btn btn-default btn-sm"><i class="fas fa-heart"></i>
                Suco</button>
            <span class="float-right text-muted">${ eval(postData.begenenler).length} Suco - ${eval(postData.yorumlar).length} Yorum</span>
        </div>
        <!-- /.card-body -->
        <div class="card-footer card-comments" style="display: block;">
        ${await Dom.commentRender(postData.yorumlar)}
        </div>
        <!-- /.card-footer -->
        <div class="card-footer" style="display: block;">
                <img class="img-fluid img-circle img-sm" src="dist/img/user4-128x128.jpg" alt="Alt Text">
                <!-- .img-push is used to add margin to elements next to floating images -->
                <div class="img-push">
                    <input type="text" class="form-control form-control-sm comment-form" placeholder="Yorum bırak...">
                </div>
        </div>
        <!-- /.card-footer -->
    </div>`;
    postsPlace.innerHTML += singleImagePostTemp;
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
                console.log(commentData[i]);
                console.log(user);
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
}