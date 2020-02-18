// main function
$(function () {
    getArticle();

    $('#search').val('')

    $('#callModal').click(function () {
        $('#modalArticle').modal('show')
        $('#title').val('')
        $('#description').val('')
        $('#image').val('')
        // set 'Add Record' as title of add modal
        $('#modalTitle').text('Add Record')
    })

    // when click on button Save
    $('#btnSave').click(function () {
        let newArticles = {
            TITLE: $('#title').val(),
            DESCRIPTION: $('#description').val(),
            IMAGE: $('#image').val()
        }
        // check condition to know if Add or Edit
        if ($('#modalTitle').text() == 'Add Record') {
            postArticle(newArticles)
        } else {
            console.log($('#modalTitle').text())
            updateArticle(newArticles, $('#id').val())

        }
    })

    // when user search for title
    /* with JavaScript
    // let _search = document.getElementById('search');
    // _search.onkeyup = function (){
    //     searchArticle($('#search').val())
    // }

    /* with jQuery*/
    /*real time search */
    $('#search').keyup(function () {
        searchArticleByTitle($(this).val())
    })
});

// search title of the article
function searchArticleByTitle(title) {
    $.ajax({
        url: `http://110.74.194.124:15011/v1/api/articles?title=${title}&page=1&limit=6`,
        method: 'GET',
        success: function (response) {
            appendToTable(response.DATA)
        },

        error: function (error) {
            console.log(error)
        }

    })
}

// post article
function postArticle(newArticles) {
    $.ajax({
        url: 'http://110.74.194.124:15011/v1/api/articles',
        method: 'POST',
        data: JSON.stringify(newArticles),
        headers: {
            'content-type': 'application/json'
        },
        success: function (response) {
            Swal.fire(
                `${response.MESSAGE}`
            )
            getArticle()
            $('#modalArticle').modal('hide')
        },

        error: function (error) {

        }
    })
}

// get article
function getArticle() {

    $.ajax({
        url: `http://110.74.194.124:15011/v1/api/articles?page=1&limit=6`,
        method: 'GET',
        success: function (response) {
            console.log(response)
            appendToTable(response.DATA)

            totalPage = response.PAGINATION.TOTAL_PAGES
            paginator.initPaginator({
                'previousPage': 'Next',
                'nextPage': 'Prev',
                'totalPage': totalPage,
                'triggerFunc': renderPage,
                'paginationClass': 'paginatorCustomClass'
            });
        },

        error: function (error) {
            console.log(error)
        }

    })
}

function renderPage() {

    selectdPg = $('.js-paginator').data('pageSelected');

    $.ajax({
        url: `http://110.74.194.124:15011/v1/api/articles?page=${selectdPg}&limit=6`,
        method: 'get',
        success: function (response) {
            appendToTable(response.DATA)
        },
        error: function (er) {
            console.log(er);
        }
    })
}

// append to table
function appendToTable(articles) {
    let content = ''
    for (a of articles) {
        content += `
                    <!-- Card Narrower -->
<div class="col-sm-12 col-md-6 col-lg-4 my-2" >
<div class="card card-cascade narrower hoverable" >

  <!-- Card image -->
  <div class="view view-cascade">
    <img class="card-img-top" src="${a.IMAGE}" alt="Image Error 404! ">
  </div>

  <!-- Card content -->
  <div class="card-body card-body-cascade">

    <!-- Label -->
    <h5 class="pink-text pb-2 pt-1"><i class="fas fa-tags"></i> ${a.ID}</h5>
    <!-- Title -->
    <h4 class="font-weight-bold card-title headingText">${a.TITLE}</h4>
    <!-- Text -->
    <p class="card-text">${a.DESCRIPTION}</p>
    <!-- Button -->
    <button type="button" class="btn btn-rounded  btn-danger btnText" onclick="deleteArticles(this)">Delete</button>
    <button type="button" class="btn btn-rounded  btn-info btnText" onclick="goToDetail(${a.ID})">View</button>
    <button type="button" class="btn btn-rounded  btn-success btnText" onclick="showModal('${a.TITLE}', '${a.DESCRIPTION}', '${a.IMAGE}', '${a.ID}')">Edit</button>

  </div>

</div>
</div>
<!-- Card Narrower -->
        `


    }
    $('.row.adminLTE').html(content);
    $('.row.userPage').html(content);
    $('.row.article1').html(content);


}

function showModal(ti, de, im, id) {
    console.log(ti, de, im, id)
    $('#modalArticle').modal('show')
    $('#title').val(ti)
    $('#description').val(de)
    $('#image').val(im)
    $('#id').val(id)
    $('#modalTitle').text('Edit Record')
}

function updateArticle(newArticles, id) {
    $.ajax({
        url: 'http://110.74.194.124:15011/v1/api/articles/' + id,
        method: 'PUT',
        data: JSON.stringify(newArticles),
        headers: {
            'content-type': 'application/json'
        },
        success: function (response) {
            Swal.fire(
                `${response.MESSAGE}`
            )
            getArticle()
            $('#modalArticle').modal('hide')
        },

        error: function (error) {

        }
    })
}

function goToDetail(id) {
    window.location.href = `adminViewDetail.html?id=${id}`

}

// delete article
function deleteArticles(btn) {
    let _id = $(btn).siblings('h5').text()
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: `http://110.74.194.124:15011/v1/api/articles/${_id}`,
                method: 'DELETE',
                success: function (response) {
                    console.table(response)
                    getArticle()
                },

                error: function (error) {
                    console.log(e)
                }

            })
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        }
    })

}