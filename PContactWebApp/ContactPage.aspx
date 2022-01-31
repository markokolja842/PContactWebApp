<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ContactPage.aspx.cs" Inherits="PContactWebApp.ContactPage" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>

    <%--<link href="css/Animate.css" rel="stylesheet" />--%>
    <link href="css/select2.css" rel="stylesheet" />
    <link href="css/jquery.datetimepicker.css" rel="stylesheet" />
    <%--<link href="css/eonTree.css" rel="stylesheet" />--%>
    <%--<link href="css/sm-simple.css" rel="stylesheet" />--%>
<%--    <link href="css/sm-core-css.css" rel="stylesheet" />
    <link href="css/rangeslider.css" rel="stylesheet" />--%>
    <link href="css/CSSSkeleton.css" rel="stylesheet" />
    <link href="fonts/entypo.css" rel="stylesheet" />
    <link href="fonts/icomoon/icomoon.css" rel="stylesheet" />
    <link href="css/CSSSkeletonEntypo.css" rel="stylesheet" />
    <link href="css/style.css" rel="stylesheet" />
    <link href="css/style1.css" rel="stylesheet" />


    <script src="js/jquery-3.3.1.js"></script>
    <script src="js/eUtils.js?rnd=7"></script>
    <script src="js/select2.min.js"></script>


</head>
<body>

        <style type="text/css">

       .btn a {padding: 0.3em 0.4em; background-color: transparent; color: black;}
       .btn.noviPrijemni a {font-size: 0.93em; }       
       .Sablon1 .select2-container--default.select2-container--disabled .select2-selection--single{ background-color: transparent;}
       .btn.dugmeIzmeni, .btn.dugmeobrisi {margin-top:0px;} 
       .Sablon1 .sabl.dodajBorder{ border: 2px solid; padding-top: 0.3em;}
       .Sablon1 .sabl .dodajBorder .select {min-height: 3em;}
       .Sablon1 .sabl.dodajBorder .btn.dugmeSnimi {margin-top:0px; min-height: 1.6em; min-width: 5em;}
       .Sablon1 .sabl.dodajBorder .padLista3 .select2-container {border: 1px solid; min-height: 2em;}
       .Sablon1 .sabl.dodajBorder .padLista3 .select2-container .select2-selection--multiple {min-height: 29px;}
       .Sablon1 .sabl.dodajBorder .padLista4 .select2-container--default .select2-selection--single .select2-selection__rendered {border: 1px solid; min-height: 29px;}
       .SelectUpispodaci {padding-top: 10px;}
       .SelectUpispodaci .select2-container--default .select2-selection--single .select2-selection__rendered {border: 1px solid;}
       .SelectUpispodaci .padLista4 {min-height:2px;}
       /*.row div {padding-left : 0;}*/

    </style>


<%--    <form id="form1" runat="server">
        <div>
        </div>
    </form>--%>


    <div class="strana">

        <div class="row">
            <div class="twelve columns">
                <h1><span>Neki podaci</span></h1>
                <span class="linija bgd9"></span>
                <label class=""><i>Osnovni podaci</i></label>
            </div>
        </div>

        
        
        <span><b>Tip lica</b></span>
        <infobtn><label class="entypo-circled-help color_red" href="javasript:void(0);" onclick="info_window($(this));"></label></infobtn>


        <div class="row margin_input paddingBottom2em tipLica">
            <div class="eight columns">
                    <div class="input_field ico entypo-search">
                        <select class="select" dbf="lice"  tabindex="1"></select>
                        <%--<input type="hidden" dbf="pol_s" value="" />--%>
                    </div>
            </div>
        </div>

       <div class="radio_grupa_fiksna row" obavezan mark_unutra dbf="EmployeeZId" value="" text2dbf="nosilac_osiguranja_s">
            <label class="radio template" val="!id!">!naziv!</label>

        </div>
        


        <div class="row margin_input osnovniPod">
            <div class="six columns ">                
                <span><b>EmployeeZId</b></span>
                <div class="marginBottom2">
                    <label class"templateEmployeeZId" emplo="!emplo!"></label>
                    <input class="input" type="text" dbf="EmployeeZId" value="" maxlength="50" reg="[^\s]+" />
                </div>

            </div>
        </div>



        <div class="row margin_input osnovniPod">
            <div class="six columns ">                
                <span><b>EmployeeZName</b></span>
                <div class="marginBottom2">
                    <input class="input" type="text" dbf="EmployeeZName" value="" maxlength="50" reg="[^\s]+" />
                </div>

            </div>
        </div>


        <div class="row margin_input osnovniPod">
            <div class="six columns ">                
                <span><b>EmployeeZPrezime</b></span>
                <div class="marginBottom2">
                    <input class="input" type="text" dbf="EmployeeZPrezime" value="" maxlength="50" reg="[^\s]+" />
                </div>

            </div>
        </div>


        <div class="row margin_input osnovniPod">
            <div class="six columns ">                
                <span><b>jmbg</b></span>
                <div class="marginBottom2">
                    <input class="input" type="text" dbf="jmbg" value="" maxlength="50" reg="[^\s]+" />
                </div>

            </div>
        </div>


        <div class="row margin_input osnovniPod">
            <div class="six columns ">                
                <span><b>Department</b></span>
                <div class="marginBottom2">
                    <input class="input" type="text" dbf="Department" value="" maxlength="50" reg="[^\s]+" />
                </div>

            </div>
        </div>



        <div class="row margin_input osnovniPod">
            <div class="six columns ">                
                <span><b>Pol</b></span>
                <div class="marginBottom2">
                    <input class="input" type="text" dbf="Pol" value="" maxlength="50" reg="[^\s]+" />
                </div>

            </div>
        </div>


        <div class="row margin_input osnovniPod">
            <div class="six columns ">                
                <span><b>Username</b></span>
                <div class="marginBottom2">
                    <input class="input" type="text" dbf="Username" value="" maxlength="50" reg="[^\s]+" />
                </div>

            </div>
        </div>


        <div class="row margin_input osnovniPod">
            <div class="six columns ">                
                <span><b>Passw</b></span>
                <div class="marginBottom2">
                    <input class="input" type="text" dbf="Passw" value="" maxlength="50" reg="[^\s]+" />
                </div>

            </div>
        </div>

        <div class="row margin_input marginBottom2">
            <%--<span class="linija bgd9"></span>--%>
            <div class="btn bgd9 right ">
                <a onclick="Klikni();">Neko dugme</a>
            </div>
        </div>



    </div>

    <div class="invisible modal_container">
        <form id="form2" enctype="multipart/form-data" method="post" class="form_modal">
            <div class="modal_inner_container relative">
                <div class="modal-bg modal-ready"></div>
                <div class="modal-wrap modal-auto-cursor modal-ready" tabindex="-1">
                    <div class="modal-container modal-s-ready modal-inline-holder">
                        <div class="modal-content">
                            <div class="uc_loading">
                                <div class="loading">
                                    <div class="loading_img" style="display:block; width:100%; background:#E20010; padding:1em; color:#fff;">
                                        <div style="width:20%; display:inline-block; padding-left:1em;">
                                            <label style="padding-bottom:0.5em;">Molimo, sačekajte...</label>
                                            <img src="images/onpoint-preloaderrrr.gif" style="display:inline-block;" />
                                        </div>
                                    </div>
                                </div>
                                <div class="loading_text">
                                    <label></label>
                                </div>
                            </div>
                            <div class="uc_container"></div>
                            <button title="Close (Esc)" type="button" class="modal-close">×</button>
                        </div>
                    </div>
                </div>
            </div>         
    </form>
</div>


    <%------------------%>

<%--            <div class="Sablon invisible" >
            <div class="row sabl"  id="!id!">
                <div class="two columns padLista1">
                    <select class="select" dbf="idskola" disabled></select>
                </div>
           
                <div class="two columns padLista2">
                    <select class="select"  dbf="idUG" disabled></select>
                </div>

                <div class="four columns padLista3">
                    <select  class="select"  disabled dbf="prijave" ></select>
                </div>

                <div class="two columns padLista4">
                    <select class="select"  dbf="idStatus" disabled ></select>
                </div>

                <div class="one columns dugmeIz">
                    <button class="btn dugmeIzmeni"><a href="javascript:void(0);" onclick="Izmeni(!id!);">Izmeni</a></button>
                </div>

                <div class="one columns dugmeOb">
                    <button class="btn dugmeobrisi"><a  href="javascript:void(0);" onclick="Obrisi(!id!);">Obriši</a></button>
                </div>

                <div class="one columns dugmeSn invisible">
                    <button class="btn dugmeSnimi"><a  href="javascript:void(0);" onclick="Snimi(!id!);">Snimi</a></button>
                </div>

            </div>

        </div>

        <hr>

        <div class="Sablon1">

        </div>--%>

        <hr class="razmak">


         <%--<div class="row SelectUpispodaci"> 

                <div class="two columns padLista1">
                    <select class="select" dbf="idskola" placeholder >
                    </select>
                </div>
           
                <div class="two columns padLista2">
                    <select class="select"  dbf="idUG" placeholder >                       
                    </select>
                </div>

                <div class="four columns padLista3">
                    <select  class="select"  dbf="prijave"  ></select>
                </div>

                <div class="two columns padLista4 " >
                    <input type="hidden" class="select"  dbf="idStatus"></input>
                </div>

                <div class="two columns">
                    <button class="btn noviPrijemni"><a href="javascript:void(0);" onclick="noviPrijemni();">Novi prijemni ispit</a></button>
                </div>        

        </div>--%>


      <%-----------------------%>

    <div id="sql_insert_korak" runat="server" visible="false">
        INSERT INTO dbo.DepartmentAPI(DepartmentName)VALUES(N'!Department!')
    </div>

    <script type="text/javascript">


        var skole = [{ "id": 1, "naziv": "Srednja skola 1" },
        { "id": 2, "naziv": "Srednja skola 2" },
        { "id": 3, "naziv": "Srednja skola 3" },
        { "id": 4, "naziv": "Srednja skola 4" },
        { "id": 5, "naziv": "Srednja skola 5" },
        { "id": 6, "naziv": "Srednja skola 6" }];

        var upsne_grupe = [{ "id": 1, "naziv": "Upisna grupa 1" },
        { "id": 2, "naziv": "Upisna grupa 2" },
        { "id": 3, "naziv": "Upisna grupa 3" },
        { "id": 4, "naziv": "Upisna grupa 4" },
        { "id": 5, "naziv": "Upisna grupa 5" },
        { "id": 6, "naziv": "Upisna grupa 6" }];

        var statusi = [{ "id": 1, "naziv": "Status 1" },
        { "id": 2, "naziv": "Status 2" },
        { "id": 3, "naziv": "Status 3" },
        { "id": 4, "naziv": "Status 4" },
        { "id": 5, "naziv": "Status 5" },
        { "id": 6, "naziv": "Status 6" }];

        var srednjaSkola_upisnaGrupa = [{ "id": 1, "idskola": "2", "idUG": "1", "prijave": "[3,4]", "idStatus": 1 },
        { "id": 2, "idskola": "1", "idUG": "2", "prijave": "[]", "idStatus": 1 },
        { "id": 3, "idskola": "2", "idUG": "3", "prijave": "[1,3]", "idStatus": 1 },
        { "id": 4, "idskola": "4", "idUG": "5", "prijave": "[5,6]", "idStatus": 1 }];


        var polovi = [{ "id": "0", "naziv": " --- " }, { "id": "1", "naziv": "Muški" }, { "id": "2", "naziv": "Ženski" }];
        var tipoviLica = [{ 'id': '1', 'naziv': 'Fizičko lice' }, { 'id': '2', 'naziv': 'Pravno lice' }];
        var dobaOsobe = [{ 'id': 'C', 'naziv': 'Dete' }, { 'id': 'A', 'naziv': 'Odrasla osoba' }, { 'id': 'R', 'naziv': 'Starija osoba' }];

        var rg1;

        var podaciS = <%=podaci%>;
        var podaciJedan = <%=podaci1%>;


        $(function() {

            $('[dbf="lice"]').initSelect(polovi);
            /*$(':dbf(TipLica) select').prepend('<option value="-1" >--------</option> ');*/
            /*$('[dbf="TipLica"] select').vrednost('-1');*/


            rg1 = new RadioButtonGroup($('[dbf="EmployeeZId"]'), dobaOsobe);

            

            var obj = $('.strana').initObjectByDBFs();

            $(".strana").initDBFsByObject(podaciJedan[0]);


            //$('.Sablon .padLista1 select').initSelect(skole);
            //$('.Sablon .padLista2 select').initSelect(upsne_grupe);
            //$('.Sablon .padLista3 select').initSelect(skole);
            //$('.Sablon .padLista4 select').initSelect(statusi);

            //renderSkole();

            //$('.SelectUpispodaci .padLista1 .select').initSelect(skole);
            //$('.SelectUpispodaci .padLista2 .select').initSelect(upsne_grupe);
            //$('.SelectUpispodaci .padLista3 .select').initSelect(skole);

            //$('.SelectUpispodaci  select').select({
            //    placeholder: 'Izaberite opciju',
            //    minimumResultsForSearch: Infinity
            //});



        });

        //function fn_promenaDestinacije(el) {
        //    el.find('select').blur();
        //}

        function Klikni() {

            var obj = $('.strana').initObjectByDBFs();


            var niz = [];

            //niz.initObjectByDBFs();

            //ajaxPost({ "Lice": "1" }, function (result) {
            //    result = JSON.parse(result);

            //    console.log(niz);

            //});

            //obj = JSON.stringify(obj);

            //popup();

            ajaxPost({ "Lice": "1", "Podaci" : obj }, function (result) {
                popupHide();
                var odgovor = JSON.parse(result);
                console.log(odgovor);
            });
        }




        function renderSkole() {
            $('.Sablon1 ').html("");


            $('.Sablon1 ').renderListInContainer($('.Sablon'), srednjaSkola_upisnaGrupa);

            for (var i = 0; i < srednjaSkola_upisnaGrupa.length; i++) {
                var id = srednjaSkola_upisnaGrupa[i].id;
                if (!Array.isArray(srednjaSkola_upisnaGrupa[i].prijave)) srednjaSkola_upisnaGrupa[i].prijave = JSON.parse(srednjaSkola_upisnaGrupa[i].prijave);

                $('.Sablon1 .sabl[id="' + id + '"]').initDBFsByObject(srednjaSkola_upisnaGrupa[i]);
            }

            $('.Sablon1 select').select2({
                placeholder: 'Izaberite opciju',
                minimumResultsForSearch: Infinity
            });

        }

        function Snimi(id) {

            var skola1 = $('.Sablon1 [id = "' + id + '"] .padLista1 select option:selected').text();
            var idSkola1 = $('.Sablon1 [id = "' + id + '"] .padLista1 select option:selected').val();
            var upisnaGrupa = $('.Sablon1 [id = "' + id + '"]  .padLista2 select option:selected').text();
            var idUpisnaGrupa = $('.Sablon1 [id = "' + id + '"]  .padLista2 select option:selected').val();

            var pomNiz = srednjaSkola_upisnaGrupa.filter(function (el) { return el.id != id; });
            srednjaSkola_upisnaGrupa = pomNiz;

            var broj = srednjaSkola_upisnaGrupa.length + 1;

            var result = $('.Sablon1 [id = "' + id + '"]').initObjectByDBFs(srednjaSkola_upisnaGrupa);
            result["id"] = id;

            if ($('.Sablon1 [id = "' + id + '"] .padLista3 select option:selected').val() == undefined) result["prijave"] = "[]";

            srednjaSkola_upisnaGrupa.push(result);

            srednjaSkola_upisnaGrupa.sortBy("id");

            renderSkole();

            $('.Sablon1 [id = "' + id + '"] .dugmeOb, .Sablon1 [id = "' + id + '"] .dugmeIz').removeClass('invisible');
            $('.Sablon1 [id = "' + id + '"] .dugmeSn').addClass('invisible');
            $('.Sablon1 [id = "' + id + '"]').removeClass("aktivan");

        }

        function Obrisi(id) {
            if (confirm("Da li želite da nastavite sa brisanjem?")) {

                console.log('Prihvatili ste!');
            } else {

                console.log('Niste prihvatili!');
                return;
            }

            srednjaSkola_upisnaGrupa.sortBy("id");

            var pomNiz = srednjaSkola_upisnaGrupa.filter(function (el) { return el.id != id; });

            srednjaSkola_upisnaGrupa = pomNiz;
            renderSkole();
        }


        function Izmeni(id) {
            var brojac = 0;
            $('.Sablon1').each(function () {
                brojac++;

                if ($(this).hasClass("aktivan")) return;
                console.log(brojac);
            });

            $('.Sablon1 [id = "' + id + '"]').addClass("aktivan");
            $('.Sablon1 [id = "' + id + '"] .padLista3 .select').removeAttr("disabled");
            $('.Sablon1 [id = "' + id + '"] .padLista4 .select').removeAttr("disabled");
            $('.Sablon1 [id = "' + id + '"] .dugmeOb, .Sablon1 [id = "' + id + '"] .dugmeIz').addClass('invisible');
            $('.Sablon1 [id = "' + id + '"] .dugmeSn').removeClass('invisible');
            $('.Sablon1 [id = "' + id + '"]').addClass('dodajBorder');
            console.log(id);

        }


        function noviPrijemni() {

            var skola1 = $('.SelectUpispodaci .padLista1 select option:selected').text();
            var idSkola1 = $('.SelectUpispodaci .padLista1 select option:selected').val();
            var upisnaGrupa = $('.SelectUpispodaci .padLista2 select option:selected').text();
            var idUpisnaGrupa = $('.SelectUpispodaci .padLista2 select option:selected').val();


            if (idSkola1 == "" || idUpisnaGrupa == "") {
                notify({ 'rezultat': -1, 'poruka': "Greška! Odaberite opciju!" });
                return;
            }

            var nadjIdskole = srednjaSkola_upisnaGrupa.filtriraj("idskola", idSkola1);
            var nadjiUpisne = nadjIdskole.filtriraj("idUG", idUpisnaGrupa);

            if (nadjiUpisne.length > 0) {
                $('.SelectUpispodaci').addErrorMark("Imate ovaj podatak!");
                notify({ 'rezultat': -1, 'poruka': "Greška! Odabrana opcija postoji!" });
                return;
            }

            $('.SelectUpispodaci').removeErrorMark();
            srednjaSkola_upisnaGrupa.sortBy("id");

            var broj = 1;
            var max = 1;

            if (srednjaSkola_upisnaGrupa.length != 0) {
                broj = srednjaSkola_upisnaGrupa.length - 1;
                max = srednjaSkola_upisnaGrupa[broj].id + 1;
            }

            var result = $('.SelectUpispodaci ').initObjectByDBFs(srednjaSkola_upisnaGrupa);
            result["id"] = max;

            if ($('.SelectUpispodaci .padLista3 select option:selected').val() == undefined)
                result["prijave"] = "[]";
            result["idStatus"] = 1;

            srednjaSkola_upisnaGrupa.push(result);
            console.log(srednjaSkola_upisnaGrupa);

            renderSkole();

        }



    </script>

</body>
</html>
