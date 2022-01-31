<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Glavna.aspx.cs" Inherits="PContactWebApp.Glavna" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>

    
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

</head>

<style>

    body{height : 100vh;}

    /*.container{width: 100%; height: 100%;  scroll-behavior:smooth; scroll-snap-type: y mandatory; overflow-y: scroll;}*/
    
    .container{width: 100%; height: 100vh;  scroll-behavior:smooth; scroll-snap-type: y mandatory; overflow-y: scroll;}

   /* #section1,#section2, #section3, #section4  { display: flex; flex-direction: column; align-items:center; justify-content: center; text-align: center; width: 100%; height : 100vh; scroll-snap-align: start;}*/

     #section1,#section2, #section3, #section4 { align-items:center; justify-content: center; text-align: center; width: 100%; height : 100vh; scroll-snap-align: start;}

     #section1{ background-color: cornflowerblue;}

     #section2{ background-color: antiquewhite;}

     #section3{ background-color: burlywood;}

     #section4{ background-color: aquamarine;}

    #section h1{ font-size: 2em;}

    #section p{ font-size: 1em;}

</style>

<body>


    <div class="container">

   
        <div id="section1">
            <h1>Prva sec</h1>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                but also the leap into electronic typesetting, remaining essentially unchanged. </p>
            <a href="#section2">Click Me to Smooth Scroll to Section 2 Below</a>
        </div>

        <div id="section2">
            <h1>Druga sec</h1>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                but also the leap into electronic typesetting, remaining essentially unchanged. </p>
            <a href="#section3">Click Me to Smooth Scroll to Section 3 Below</a>
        </div>


        <div id="section3">
            <h1>Treca sec</h1>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                but also the leap into electronic typesetting, remaining essentially unchanged. </p>
            <a href="#section4">Click Me to Smooth Scroll to Section 4 Below</a>
        </div>

        <div id="section4">
            <h1>Cetvrta sec</h1>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
                but also the leap into electronic typesetting, remaining essentially unchanged. </p>
        </div>

     </div>


    <script  type="text/javascript">


        $(document).ready(function () {
            // Add smooth scrolling to all links
            $("a").on('click', function (event) {

                // Make sure this.hash has a value before overriding default behavior
                if (this.hash !== "") {
                    // Prevent default anchor click behavior
                    event.preventDefault();

                    // Store hash
                    var hash = this.hash;

                    // Using jQuery's animate() method to add smooth page scroll
                    // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
                    $('html, body').animate({
                        scrollTop: $(hash).offset().top
                    }, 800, function () {

                        // Add hash (#) to URL when done scrolling (default click behavior)
                        window.location.hash = hash;
                    });
                } // End if
            });
        });

    </script>

</body>
</html>
