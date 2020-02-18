$(function () {
    let url = window.location.href
    let id = url.split('?')
    console.log();
    let ID = id[1].substr(3, id[1].length - 3)
    getAnArticle(ID)
})

function getAnArticle(id) {
    $.ajax({
        url: `http://110.74.194.124:15011/v1/api/articles/${id}`,
        method: `GET`,
        success: function (response) {
            showInJumbotron(response.DATA)
        },

        error: function (error) {

        }
    })

}

function showInJumbotron(article) {
    $('.jumbotronContainer').html(`
                <!-- News jumbotron -->
        <div class="jumbotron text-center hoverable my-3 mb-4 p-4">

          <!-- Grid row -->
          <div class="row">

            <!-- Grid column -->
            <div class="col-md-4 offset-md-1 mx-3 my-3">

              <!-- Featured image -->
              <div class="view overlay">
                <img src="${article.IMAGE}"
                  class="img-fluid" alt="Siem Reap Province">
                <a>
                  <div class="mask rgba-white-slight"></div>
                </a>
              </div>

            </div>
            <!-- Grid column -->

            <!-- Grid column -->
            <div class="col-md-7 text-md-left ml-3 mt-3">

              <h4 class="h3 font-weight-bold mb-4 headingText">${article.TITLE}</h4>

              <p class="font-weight-normal">${article.DESCRIPTION}</p>
            </div>
            <!-- Grid column -->

          </div>
          <!-- Grid row -->

        </div>
        <!-- News jumbotron --></div>
            
            `)
}

