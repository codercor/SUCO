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
    static postRender(postData) {
        postData.resim = Adapters.postImageAdapter(postData.resim);
        let user = new User();
        
        if (postData.resim.length == 0) {
            let noImagePostTemp = `<div class="card card-widget offset-md-2 col-md-8">
    <div class="card-header">
        <div class="user-block">
            <img class="img-circle" src="dist/img/user1-128x128.jpg" alt="User Image">
            <span class="username"><a href="#">Mustafa Çor</a></span>
            <span class="description">Herkese Açık - Bugün</span>
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

        <p>Yeni masa aldım güzel mi arkadaşlar ?</p>
        <button type="button" class="btn btn-default btn-sm"><i class="fas fa-share"></i>
            Paylaş</button>
        <button type="button" class="btn btn-default btn-sm"><i class="fas fa-heart"></i>
            Suco</button>
        <span class="float-right text-muted">127 Suco - 3 Yorum</span>
    </div>
    <!-- /.card-body -->
    <div class="card-footer card-comments" style="display: block;">
        <div class="card-comment">
            <!-- User image -->
            <img class="img-circle img-sm" src="dist/img/user3-128x128.jpg" alt="User Image">

            <div class="comment-text">
                <span class="username">
                    Sezen Aksu
                    <span class="text-muted float-right">Bugün</span>
                </span><!-- /.username -->
                Tam üzerinde şarkı yazmalık masa Mustafa'cığım bana 50 liraya bırak. :)
            </div>
            <!-- /.comment-text -->
        </div>
        <!-- /.card-comment -->
        <div class="card-comment">
            <!-- User image -->
            <img class="img-circle img-sm" src="dist/img/user4-128x128.jpg" alt="User Image">

            <div class="comment-text">
                <span class="username">
                    Ayşe Abla
                    <span class="text-muted float-right">Bu sabah</span>
                </span><!-- /.username -->
                Hiç beğenmedim benim masam daha güzel.
            </div>
            <!-- /.comment-text -->
        </div>
        <!-- /.card-comment -->
    </div>
    <!-- /.card-footer -->
    <div class="card-footer" style="display: block;">
        <form action="#" method="post">
            <img class="img-fluid img-circle img-sm" src="dist/img/user4-128x128.jpg" alt="Alt Text">
            <!-- .img-push is used to add margin to elements next to floating images -->
            <div class="img-push">
                <input type="text" class="form-control form-control-sm" placeholder="Yorum bırak...">
            </div>
        </form>
    </div>
    <!-- /.card-footer -->
</div>`;
        }
    }
}