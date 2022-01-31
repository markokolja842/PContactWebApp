﻿(function () {

    var AppConfig = {

        UseMark_Obavezan : false,
        UseMark_ValidInput: false,
        UseMark_PromenaVrednosti: false,
        ErrorPoruke_StalnoVidljive: true
    }


    function CUtils() {

        this.initEvents = function (el) {

            if (arguments.length == 0) var el = $('body');

            //radiobutton
            $(el).find('div:not(.radio_grupa) > label.radio').click(function () {
                if ($(this).attr('disabled') == 'disabled') return;
                $(".radio[name='" + $(this).attr('name') + "']").removeClass('checked');
                $(this).toggleClass('checked'); $(this).val($(this).hasClass('checked'));

                //if ($(this).attr('old_val') == null) return;
                //if ($(this).attr('old_val') != $(this).val()) { $(this).parent().addClass('changed_value'); return; }
                //else $(this).parent().removeClass('changed_value');
            });

            // checkboxovi
            $(el).find('label.checkbox, label.toggle').click(function () {
                if ($(this).attr('disabled') == 'disabled') return;
                $(this).toggleClass('checked');
                $(this).izlaz();
            });

            $(el).find('label.checkbox, label.toggle, label.radio').each(function () {
                if ($(this).find('span').length == 0) $(this).prepend('<span></span>');
            });
            
            // multiline input i textarea
            $(el).find('input[multiline]').each(function () {
                $(this).replaceWith(function () {
                    var attrs = {};

                    $.each($(this)[0].attributes, function (idx, attr) {
                        attrs[attr.nodeName] = attr.nodeValue == "" ? "1" : attr.nodeValue;
                    });
                    attrs.text = $(this).text();
                    return $("<textarea ></textarea>", attrs);
                });

            });
            $(el).find('textarea').keyup(function () { $(this).heightAdjust(); });


            // Multi select
            $(el).find('.multi.select').each(function () {
                $(this).html('<select multiple="multiple"> </select>');
                $(this).children().last().select2({ 'tags': true });
                $(this).on('select2:select, select2:unselect', function () { $(this).izlaz(); });
            });
            $(el).find('.single.select').each(function () {
                $(this).html('<select> </select>');
                if ($(this).is('.single.select')) $(this).children().last().select2({ minimumInputLength: ( $(this).is("[minInput]") ? $(this).attr("minInput") : 0) , placeholder: $((this)).attr('placeholder') != undefined ? $(this).attr('placeholder') : '', minimumResultsForSearch: $((this)).attr('searchbox') != undefined ? $(this).attr('searchbox') : '10' });
                $(this).on('select2:select, select2:unselect', function () { $(this).izlaz(); });
            });

            $(el).find('[dbflist]').each(function () {
                if (window[$(this).attr('dbflist')] != null) $(this).initSelect(window[$(this).attr('dbflist')], false);
            });

            $(el).find('[dbfoptlist]').each(function () {
                if (window[$(this).attr('dbfoptlist')] != null) $(this).children('select').append(window[$(this).attr('dbfoptlist')], false);
            });

            // Dodavanje blur eventa na sve inpute i selecte
            $(el).find('.input, .select select').blur(function () { $(this).izlaz(); });
            $(el).find('.input[tip]').focus(function () { $(this).val($(this).attr('vrednost')); });

            // Dodavanje zvezdice ispred obaveznih polja
            $(el).find('[obavezan]').each(function () { if (app.Config.UseMark_Obavezan) $(this).addMark('obavezan', true); });

            // Dodavanje regularnog izraza email polju
            $(el).find('[email]').attr('reg', '^\\w+[\\w-\\.]*\\@\\w+((-\\w+)|(\\w*))\\.[a-z]{2,3}$');

            // Inicijalizacija tab-ova
            $(el).find('.eon_tab').each(function () {
                var links = $(this).find(' > .tab_links  > .tablink');

                links.find('a').click(function (event) { Utils.tablLinkClick($(this).parent().parent().parent(), $(this).parent().index()); });
                
                $(this).append('<div class="tabs"></div>');
                var tabs = $(this).children().last();

                for (var it = 0; it < links.length; it++) {
                    tabs.append('<div class="tab" > </div>');
                    var selector = $(links[it]).attr('sadrzaj');
                    $(selector).appendTo(tabs.children().last());
                }

                $(links.find('a')[0]).trigger('click');

            });

            $(el).find('[contenteditable]').on('paste', function (e) {

                e = e || window.event;
                e.preventDefault();

                e = e.originalEvent;

                var pastedText = undefined;
                if (window.clipboardData && window.clipboardData.getData) { // IE
                    pastedText = window.clipboardData.getData('Text');

                    if (document.selection && document.selection.createRange) {
                        var range = document.selection.createRange();
                        if (range.pasteHTML) {
                            range.pasteHTML(pastedText);
                        }
                    }
                } else if (e.clipboardData && e.clipboardData.getData) {
                    pastedText = e.clipboardData.getData('text/plain');
                    document.execCommand("insertHTML", false, pastedText);
                }

            });
            $(el).find('[contenteditable]').on('change', function () {
                $(this).text($(this).text());
            });

            // Datum
            $.datetimepicker.setLocale('sr-YU');
            $(el).find('[date_picker]').datetimepicker({
                format: 'd.m.Y',
                timepicker: false,
                minDate: '-1970/01/01',//(for today use 0 or -1970/01/01)
                maxDate: '+1970/06/01'//tomorrow is maximum date calendar
            });
 

            // Dodavanje informativnih polja
            $(el).find(':not(poruka)[info1]').each(function () { $(this).addInfoMark($(this).attr('info1'), 1); });
            $(el).find(':not(poruka)[info2]').each(function () { $(this).addInfoMark($(this).attr('info2'), 2); });

            // inicijalizacija pokreta putem strelica kroz polja
            //initTabMoveEvents(el);

            // neki stil, ne znam sta je ovo
            var stil = '';
            $(el).find('[hover]').each(function () { stil += '[hover="' + $(this).attr('hover') + '"]:hover:before { color: ' + $(this).attr('hover') + '}\n'; });
            $(el).find('[hover_back]').each(function () { stil += '[hover_back="' + $(this).attr('hover_back') + '"]:hover:before { background-color: ' + $(this).attr('hover_back') + '}\n'; });
            if (stil != '') $('body').prepend('<style>' + stil + '</style>\n\r');

            // Postavljanje texta u povezani dbf objekat
            var f2 = function (el) {

                $(el).find('select').change(function () {
                    var noviDbf = $(this).parents().filter('[text2dbf]').first().attr('text2dbf');
                    $(this).parents().filter('[text2dbf]').parent().find('[dbf="' + noviDbf + '"]').vrednost($(this).find('option:selected').text());
                })

                $(el).find('label.radio').click(function () {
                    if (!$(this).hasClass('disabled'))
                    {
                        var noviDbf = $(this).parents().filter('[text2dbf]').first().attr('text2dbf');
                        $(this).parents().filter('[text2dbf]').parent().find('[dbf="' + noviDbf + '"]').val($(this).text());
                    }
                })

            }

            $(el).find('[text2dbf]').each(function () { f2(el); });
            if ($(el).is('[text2dbf]')) f2(el);

            $(el).find('[format]').each(function () { $(this).adjustFormat(); });
        };

        this.checkRegEx = function (reg, value) {
            reg = new RegExp(reg);
            return reg.test(value);
        }.bind(this);

        this.tablLinkClick = function (tab, index) {

            var aktivni = tab.find('.tabs .tab.active');
            if (aktivni.length == 0) {
                tab.find('.tab:not(:first)').fadeOut(300, function () {
                    tab.find('.tab:first').addClass('active');
                    tab.find(' > .tab_links .tablink:first').addClass('pressed');
                    return;
                });
            }
            
            if (aktivni.index() == index) return;
            

            var aktLink = tab.find(' > .tab_links .tablink.pressed').first();
            $(tab.find(' > .tab_links .tablink')[index]).addClass('pressed');
            aktLink.removeClass('pressed');

            aktivni.removeClass('active').fadeOut(200, function () {
                aktivni = $(tab.find('.tabs .tab')[index]);
                aktivni.addClass('active').fadeIn(300);
            });

        }.bind(this);

        this.getKeys = function (obj) {

            var keys = [];

            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    keys.push(i);
                }
            }
            return keys;
        }.bind(this);

        this.replaceKeys = function(text, obj) {

            var keys = this.getKeys(obj);
            var newText = text;

            for (var it = 0; it < keys.length; it++) {
                newText = newText.replaceAll('!' + keys[it] + '!', obj[keys[it]]);
            }

            newText = newText.replaceAll('_src', 'src');
            newText = newText.replaceAll('<omg', '<img');
            return newText;
        }.bind(this);

        this.gradientColor = function (startColor, endColor, percent) {
            var start_red = parseInt(startColor.substr(0, 2), 16),
                start_green = parseInt(startColor.substr(2, 2), 16),
                start_blue = parseInt(startColor.substr(4, 2), 16);

            var end_red = parseInt(endColor.substr(0, 2), 16),
                end_green = parseInt(endColor.substr(2, 2), 16),
                end_blue = parseInt(endColor.substr(4, 2), 16);

            var diff_red = end_red - start_red;
            var diff_green = end_green - start_green;
            var diff_blue = end_blue - start_blue;

            var red = parseInt(diff_red * percent + start_red).toString(16);
            var green = parseInt(diff_green * percent + start_green).toString(16);
            var blue = parseInt(diff_blue * percent + start_blue).toString(16);

            if (red.length == 1)
                red = '0' + red

            if (green.length == 1)
                green = '0' + green

            if (blue.length == 1)
                blue = '0' + blue

            var value = "#" + red + green + blue;
            return value;
        }.bind(this);

        this.isDigit = function (c) {
                return c >= '0' && c <= '9';
        }

        this.numformat = function (broj, format, sepD, sepH) {
            if (format.indexOf(',') < 0) sepH = '';
            var levo = format.split('.')[0];
            var desno = '';
            var decimala = 0;

            if (format.indexOf('.') >= 0) desno = format.split('.')[1];

            var prefiks = '';
            var sufiks = '';

            if (desno == '') {
                var it = 1;
                var nLevo = levo.replace(',', '.');
                while ((this.isDigit(nLevo.substring(it-1, it)) || nLevo.substring(it-1, it) == '.')  && it < nLevo.length) { it++; }
                if (it > 0) sufiks = nLevo.substring(it-1);
            }

            if (isNaN(desno) && desno.length > 0) {
                var it = 1;
                while (this.isDigit(desno.substring(it-1, it)) && it < desno.length) { it++; }
                if (it > 0) sufiks = desno.substring(it-1);
            }

            desno = desno.replace(sufiks, '').replaceAll(' ', '');
            decimala = desno.length;

            // TODO implementirati i prefikse
            //if (isNaN(levo) && levo.length > 0) {
            //    var it = 0;
            //    var nLevo = levo.replace(',', '.');
            //    while (isNaN(nLevo.substring(it)) && it < nLevo.length) { it++; }
            //    if (it > 0) prefiks = nLevo.substring(0, it);
            //}

            //console.log(levo);
            //console.log(desno);
            //console.log(prefiks);
            //console.log(sufiks);

            var b = broj.split('.');
            var p = b[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, sepH);

            if (decimala == 0) return prefiks + p + sufiks;

            var d = ('0000000000' + (parseFloat((b[1] + '0000000000').slice(0, 10)) + 5 * (Math.pow(10, 10 - decimala - 1))).toString()).slice(-10).substring(0, decimala);
            //console.log(decimala);
            //console.log(d);
            return prefiks + p + sepD + d + sufiks;
        }
    }

    function App() {

        this.Config = AppConfig;

        if (window.app != null) return app;

        this.UserControls = [];

        this.ValidacionaPravila = [];

        this.addUserControl = function (uc) {

            if (uc.vrednost == null) {
                console.log('Funkcija vrednost nije implementirana!');
                return;
            }

            if (uc.daLiJeObjekatOvogTipa == null) {
                console.log('Funkcija pripada nije implementirana!');
                return;
            }

            this.UserControls.push(uc);
        }

        this.vratiUserControlu = function (obj) {

            for (var it = 0; it < this.UserControls.length; it++) {
                if (this.UserControls[it].$el.attr('dbf') == obj.attr('dbf')) return this.UserControls[it];
            }
            return null;
        }

        this.onResize = [];

        //this.bezProveriValidnosti = false;

    }

    function CSortUtils () {

        this.formComplexValue = function (instr, obj) {

            var sortArray = instr.split(',');
            var povratno = '';
            for (var it = 0; it < sortArray.length; it++) {
                var sortKey = $.trim(sortArray[it]).split(' ');
                var tip = sortKey[1] == 'date' ? 2 : sortKey[1] == 'number' ? 1 : 0;
                var smer = ($.trim(sortKey[2] || '') == 'desc' ? '-' : '');


                povratno += obj[sortKey[0]] + '@'  + tip + smer  + '||';
            }
            if (povratno != '') povratno = (povratno + '##').replace ('||##', '');
            return povratno;
        }

        this.sortAsComplex = function (a, b) {

            var arrA = a.sortComplexValue.split('||');
            var arrB = b.sortComplexValue.split('||');

            var it = 0; 
            while (arrA[it] == arrB[it] && it < arrA.length) {
                it++;
            }

            if (it == arrA.length) return 0;

            var tip = arrA[it].slice(-2);
            if (tip == '@0') return SortUtils.sortAsCString(arrA[it].substring(0, arrA[it].length - 2), arrB[it].substring(0, arrB[it].length - 2));
            if (tip == '@1') return SortUtils.sortAsCNumber(arrA[it].substring(0, arrA[it].length - 2), arrB[it].substring(0, arrB[it].length - 2));
            if (tip == '@2') return SortUtils.sortAsCDate(arrA[it].substring(0, arrA[it].length - 2), arrB[it].substring(0, arrB[it].length - 2));
            tip = arrA[it].slice(-3);
            if (tip == '@0-') return SortUtils.sortAsCStringDesc(arrA[it].substring(0, arrA[it].length - 2), arrB[it].substring(0, arrB[it].length - 2));
            if (tip == '@1-') return SortUtils.sortAsCNumberDesc(arrA[it].substring(0, arrA[it].length - 2), arrB[it].substring(0, arrB[it].length - 2));
            if (tip == '@2-') return SortUtils.sortAsCDateDesc(arrA[it].substring(0, arrA[it].length - 2), arrB[it].substring(0, arrB[it].length - 2));

        }

        this.sortAsCString = function (a, b) {
            if (a> b) { return 1; }
            if (a< b) { return -1; }
            return 0;
        }

        this.sortAsCNumber = function (a, b) {
            if (parseFloat(a) > parseFloat(b)) { return 1; }
            if (parseFloat(a) < parseFloat(b)) { return -1; }
            return 0;
        }

        this.sortAsCDate = function (a, b) {
            if (new Date(a) > new Date(b)) { return 1; }
            if (new Date(a) < new Date(b)) { return -1; }
            return 0;
        }

        this.sortAsCStringDesc = function (a, b) {
            if (a > b) { return -1; }
            if (a < b) { return 1; }
            return 0;
        }

        this.sortAsCNumberDesc = function (a, b) {
            if (parseFloat(a) > parseFloat(b)) { return -1; }
            if (parseFloat(a) < parseFloat(b)) { return 1; }
            return 0;
        }

        this.sortAsCDateDesc = function (a, b) {
            if (new Date(a) > new Date(b)) { return -1; }
            if (new Date(a) < new Date(b)) { return 1; }
            return 0;
        }
    }

    function CULGenerator () {

        this.LITemplate = '',

        this.ULTemplate = '',

        this.initTemplates =  function (t1, t2) {

            this.LITemplate = t1;
            this.ULTemplate = t2;
        },

        this.getKeys = function (obj) {

            return Utils.getKeys(obj);
        },

        this.replaceKeys = function (text, obj) {

            return Utils.replaceKeys(text, obj);
        },

        this.appendULNode = function (el, jsNode) {

            var ul = this.replaceKeys(this.ULTemplate, jsNode);
            el.append(ul);
        },

        this.appendLINode = function (el, jsNode) {

            var li = this.replaceKeys(this.LITemplate, jsNode);
            el.append(li);
            el.children().last().find('label[dvecifre], span[dvecifre], div[dvecifre]').each(function () { $(this).text(formatNumber($(this).text(), 2)); });
            el.children().last().find('input[dvecifre]').each(function () { $(this).val(formatNumber($(this).attr('old_val'), 2)); });
            el.children().last().find('label[tricifre], span[tricifre], div[tricifre]').each(function () { $(this).text(formatNumber($(this).text(), 3)); });
            el.children().last().find('input[tricifre]').each(function () { $(this).val(formatNumber($(this).attr('old_val'), 3)); });

        },

        //this.handleLI = function (json, jsnode, div, wrappingUL) {

        //    var parentNode = $(div);
        //    if (parentNode.find('li[idd="' + jsnode.id + '"]').length > 0) return false ;
        //    if (jsnode.parent == "0" || jsnode.parent == jsnode.id) {

        //        if (parentNode.children().length == 0 && wrappingUL) this.appendULNode(parentNode, jsnode);
        //        if (wrappingUL) parentNode = $(parentNode).find('> ul[idd]').first();
        //    }
        //    else {

        //        parentNode = $(div).find('li[idd="' + jsnode.parent + '"]');
        //        if (parentNode.length == 0) return true;
        //        if (parentNode.find('> ul[idd]').length == 0) { jsnode2 = json.filtriraj('id', jsnode.parent)[0]; this.appendULNode(parentNode, jsnode2); }
        //        parentNode = $(parentNode).find('> ul[idd]');
        //    }

        //    this.appendLINode(parentNode, jsnode);
        //    return false;
        //},

        this.GenerateUL = function (div, json, wrappingUL) {

            if (arguments.length == 2) wrappingUL = true;

            var moramPonovo = false;

            for (var it = 0; it < json.length; it++) {
                var jsnode = json[it];
                var parentNode = $(div);
                if (parentNode.find('li[idd="' + jsnode.id + '"]').length > 0) continue;
                if (jsnode.parent == "0" || jsnode.parent == jsnode.id) {

                    if (parentNode.children().length == 0 && wrappingUL) this.appendULNode(parentNode, jsnode);
                    if (wrappingUL) parentNode = $(parentNode).find('> ul[idd]').first();
                }
                else {

                    parentNode = $(div).find('li[idd="' + jsnode.parent + '"]');
                    if (parentNode.length == 0) { moramPonovo = true; continue; }
                    if (parentNode.find('> ul[idd]').length == 0) { jsnode2 = json.filtriraj('id', jsnode.parent)[0]; this.appendULNode(parentNode, jsnode2); }
                    parentNode = $(parentNode).find('> ul[idd]');
                }

                this.appendLINode(parentNode, jsnode);
            }

            if (moramPonovo) this.GenerateUL(div, json);
        }

        //this.For = function (UL, broj, min, korak, odmor, json, div, wrappingUL, moramPonovo) {

        //    moramPonovo = setTimeout(function (UL, broj, min, korak, odmor, json, div, wrappingUL, moramPonovo) {
        //        i = 0;
        //        var max = min + korak;
        //        if (max > broj) max = broj;
        //        while (min + i < max) {
        //            moramPonovo = moramPonovo || UL.handleLI(json, json[min + i], div, wrappingUL);
        //            i++;
        //        }
        //        if (max == broj) {
        //            if (moramPonovo) this.GenerateUL(div, json);
        //            return;
        //        }
        //        min += korak;
        //        UL.For(UL, broj, min, korak, odmor, json, div, wrappingUL, moramPonovo);
        //    }, odmor, UL, broj, min, korak, odmor, json, div, wrappingUL, moramPonovo);
        //    //var out;
        //    //for (var it = min; it < max; it++) { out = funkcija(arguments);}
        //    //if (max == broj) return out;
        //    //min += korak;
        //    //max += korak; if (max > broj) max = broj;
        //    //setTimeout(function () {
        //    //    EFor();
        //    //}, odmor, broj, min, max, korak, odmor, funkcija);
        //}

    }


    $.extend($.expr[':'], {
        dbf: function (a, i, m) {
            if (m[3] == '' || m[3] == null) return $(a).is('[dbf]');

            var ime = '[dbf="' + m[3] + '"]';
            return $(a).is(ime);
        }
    });


    $.fn.extend( {

        eInit: function () { Utils.initEvents(this); return this; },

        checked: function () {
            if (!this.is('label')) return false;
            if (!this.is('.checkbox, .radio, .toggle')) return false;

            var val = this.hasClass('checked') ? "1" : "0" ;
            return val;
        },

        check : function(b) {
            
            if (arguments.length == 0) return this.checked();

            var val = this.vrednost();
            if (b == val) return;
            this.click();
        }, 

        promenaVrednosti: function () {

            if (!app.Config.UseMark_PromenaVrednosti) return this;

            if (this.attr('notFoValidation') != null) return this;
            if (this.is('label.checkbox, label.toggle')) return this;

            var value = this.vrednost();

            if (this.attr('old_val') != value) this.addValidMark();
            else this.removeValidMark();
            return this;
        },

        addMark: function (tip, prepend) {

            var brojAttr = $('body :dbf(' + this.attr('dbf') + '):visible').length;

            if ($('mark.' + tip + '[za="' + this.attr('dbf') + '"]').length >= brojAttr && this.attr('dbf') != null) return;
            if (arguments.length == 0) prepend = false;

            this.after('<mark class="' + tip + '" za="' + this.attr('dbf') + '"></mark>');

            var mark = this.next();
            //mark.css('top', this.position().top);
            mark.css('left', this.outerWidth() + this.position().left)
            if (prepend) mark.css('left', this.position().left - 10);

            if (this.attr('mark_unutra') != null && !prepend) mark.css('left', this.outerWidth() + this.position().left - 1.3 * mark.outerWidth());
            if (tip=='error') mark.click(function () {
                $('poruka[greska][Za="' + $(this).attr('za') + '"]').css('display', 'inline-block');
                $('poruka[greska][Za="' + $(this).attr('za') + '"]').animate({ opacity: 1 }, 300);
            });

        },

        removeMark: function (tip, dbf) {

            if (arguments.length == 1 && this.attr('dbf') != null) dbf = this.attr('dbf');

            //this.next($('mark[za="' + dbf + '"].' + tip).remove());
            this.parent().find('mark[za="' + dbf + '"].' + tip).remove();
            
        },

        addErrorMark: function (mssg) {

            var uc = app.vratiUserControlu(this);
            if (uc != null) if (uc.addErrorMark != null) {
                uc.addErrorMark(mssg);
                return;
            }

            if (!this.hasClass('danger')) this.addClass('danger');

            if ($(this).children().find('poruka[greska][Za="' + this.attr('dbf') + '"]').length == 0) {
                var elSufiks = this.next().is('span[sufiks]') ? this.next() : this;
                elSufiks.after('<poruka greska za="' + this.attr('dbf') + '">' + mssg + '</poruka>');
            } else {

            

            this.addMark('error');



            //if (!this.hasClass('tooltipstered')) this.tooltip(mssg);
            if (this.next('poruka[greska][Za="' + this.attr('dbf') + '"]').length == 0) {
                this.after('<poruka greska za="' + this.attr('dbf') + '">' + mssg + '</poruka>');

                if (app.Config.ErrorPoruke_StalnoVidljive) return;

                this.focus(function () {
                    this.next('poruka[greska][Za="' + $(this).attr('dbf') + '"]').css('display', 'block');
                    this.next('poruka[greska][Za="' + $(this).attr('dbf') + '"]').animate({ opacity: 1 }, 300);
                });
                this.blur(function () {
                    this.next('poruka[greska][Za="' + $(this).attr('dbf') + '"]').css('display', 'none');
                    this.next('poruka[greska][Za="' + $(this).attr('dbf') + '"]').css('opacity', 0);
                });

                this.next('poruka[greska][Za="' + $(this).attr('dbf') + '"]').css('display', 'none');
                this.next('poruka[greska][Za="' + $(this).attr('dbf') + '"]').css('opacity', 0);
            }
            }
        },



        removeErrorMark: function () {

            var uc = app.vratiUserControlu($(this));
            if (uc != null) if (uc.removeErrorMark != null) { return uc.removeErrorMark(); }

            this.removeClass('danger');
            if (this.hasClass('tooltipstered')) this.tooltipster('destroy');
            this.next('poruka[greska][Za="' + this.attr('dbf') + '"]').remove();
            this.removeMark('error', this.attr('dbf'));
            return this;
        },

        addValidMark: function () {

            this.addClass('valid_input');
            this.addMark('valid')
        },

        removeValidMark: function () {

            var uc = app.vratiUserControlu($(this));
            if (uc != null) if (uc.removeValidMark != null) { return uc.removeValidMark(); }

            this.removeClass('valid_input');
            this.removeMark('valid', this.attr('dbf'));
            return this;
        },

        addChangedValueMark: function () {

            this.addClass('changed_value');
        },

        removeChangedValueMark: function () {

            this.removeClass('changed_value');
            return this;
        },

        addInfoMark: function (mssg, i) {

            if (arguments.length == 1) i = 1;
            var za = (this.attr('dbf') != null ? 'Za="' + this.attr('dbf') + '"' : '');
            if ((za == '') || ($('poruka[info' + i + '][' + za + ']').length == 0 && za != '')) {

                if (this.attr('pre') != null) this.before('<poruka info' + i + ' ' + za + '>' + mssg + '</poruka>');
                else this.after('<poruka info' + i + ' ' + za + '>' + mssg + '</poruka>');
            }
        },

        checkRegEx: function () {

            if (this.attr('reg') == null) return true;
            return Utils.checkRegEx(this.attr('reg'), this.vrednost());
        },

        tooltip: function (mssg) {

            if (arguments.length == 1 ) this.attr('title', mssg);
            this.tooltipster();
        },

        initSelect: function (json, reset, val) {

            if (arguments.length == 1) reset = true;
            var sel = this;
            if (this.hasClass('multi') || this.hasClass('single')) sel = this.children().first();

            if (reset) sel.html('');
            for (var it = 0; it < json.length; it++) {

                var attr = sel.attr('placeholder');
                if (it == 0 && (typeof attr !== typeof undefined && attr !== false)) {
                    sel.append('<option value=""></option>');
                }

                sel.append('<option value="' + json[it].id.toString() + '">' + json[it].naziv + "</option>");
            }

            if (arguments.length == 3) sel.val(val);
            //if (this.hasClass('multiselect')) {

            //    if (json.length == 0) return;
            //    if (json[0].text == null) {
            //        for (var it = 0; it < json.length; it++) { json[it].text = json[it].naziv; }
            //    }

            //    $(this).children().first().select2('data', json);
            //}

            
        },

        proveriObaveznaPolja : function () {

            objs = this.find('[obavezan]:visible');

            objs.each(function () {

                var vrednost = $(this).vrednost();

                if ($(this).hasClass("danger")) { }
                else { if(vrednost == "" ||vrednost == "-1" ) $(this).addErrorMark("Polje je obavezno");
                       else $(this).removeErrorMark();
                }
            });
        },

        initDBFsByObject: function (objekat) {

            var objs = this.find('[dbf]');

            app.bezProveriValidnosti = true;

            objs.each(function () {

                var vrednost = objekat[$(this).attr('dbf')];

                $(this).vrednost(vrednost);
                if (app.Config.UseMark_PromenaVrednosti) $(this).attr('old_val', vrednost);
            });

            app.bezProveriValidnosti = false;
        }, 

        initObjectByDBFs: function () {

            var objs = this.find('[dbf]');
            var objekat = {}

            objs.each(function () {

                var prop = $(this).attr('dbf');
                objekat[prop] = $(this).vrednost();
            });
            return objekat;
        },

        disable : function (b) {

            if (b) {
                this.find('input, select, textarea, label.checkbox, span, label.radio, label.toggle').attr('disabled', 'disabled');
                this.find('[contenteditable="true"]').attr('contenteditable', 'false');
            }
            else {
                this.find('input:not([readonly]), select:not([readonly]), textarea:not([readonly]), .select:not([readonly]),  .input:not([readonly]), label.checkbox:not([readonly]), span:not([readonly]), label.radio:not([readonly])').removeAttr('disabled');
                this.find('span[contenteditable="false"]:not([readonly])').attr('contenteditable', 'true');
            }
        },

        renderList: function (render, lista) {

            return this.renderListInContainer(render, lista);
        },

        renderListInContainer: function (render, lista) {

            if (lista.length == 0) return;
            if (typeof render === 'string') render = '<div>' + render + '</div>';
            render = $(render);
            this.html('');

            var groupNiz = []; var listaSort = '';
            render.find('[groupBy]').each(function () {
                groupNiz.push({ 'grupa': $(this).attr('groupBy'), 'nivo': $(this).attr('groupLevel'), 'render': $(this).html(), niz: [], sort: $(this).attr('groupSort') == undefined ? 'asc' : $(this).attr('groupSort'), valueType: $(this).attr('groupValueType') == undefined ? ' string ' : $(this).attr('groupValueType') });
            });

            groupNiz = groupNiz.sortBy('nivo number');
            for (var it = groupNiz.length - 1; it >= 0; it--) {
                listaSort += groupNiz[it].grupa + ' ' + groupNiz[it].valueType + ' ' + groupNiz[it].sort + ',';
            }

            if (render.find('[sortBy]').length > 0 || render.attr('sortBy') != null) {
                var det = render.find('[sortBy]').first();
                if (render.attr('sortBy') != null) det = render;
                listaSort += det.attr('sortBy') + ' ' + (det.attr('groupValueType') == undefined ? ' string ' : det.attr('groupValueType')) + ' ' + (det.attr('groupSort') == undefined ? 'asc' : det.attr('groupSort')) + ',';
            }

            if (listaSort != '') listaSort = (listaSort + '|').replace(',|', '');
            lista = lista.sortBy(listaSort);

            for (var it = 0; it < groupNiz.length; it++) {
                groupNiz[it].poslVred = lista[0][groupNiz[it].grupa]
            }

            if (render.find('[detail]').length > 0) render = render.find('[detail]');

            var prekini = false;
            var radneStavke = [];
            for (var it = 0; it <= lista.length; it++) {

                if (it == lista.length) { prekini = true; it = it - 1; }

                for (var jt = 0; jt < groupNiz.length; jt++) {

                    if (groupNiz[jt].poslVred != lista[it][groupNiz[jt].grupa] || prekini) {

                        if (prekini && radneStavke.length > 0) jt = 0;
                        if (jt > 0 && groupNiz[jt].poslVred != lista[it][groupNiz[jt].grupa] && radneStavke.length > 0) jt = 0;

                        var grupa = Utils.replaceKeys(groupNiz[jt].render, prekini ? lista[it] : lista[it - 1]);

                        if (jt == 0) {
                            if (radneStavke.length > 0) {
                                grupa = grupa.replace('{zapis}', radneStavke.join(''));
                                groupNiz[0].niz.push(grupa);
                                if (!prekini) groupNiz[0].poslVred = lista[it][groupNiz[jt].grupa]
                                radneStavke = [];
                            }
                        }
                        else {
                            grupa = grupa.replace('{zapis}', groupNiz[jt - 1].niz.join(''));
                            groupNiz[jt].niz.push(grupa);
                            if (!prekini) groupNiz[jt].poslVred = lista[it][groupNiz[jt].grupa];
                            groupNiz[jt - 1].niz = [];
                        }
                    }
                }

                if (prekini) break;
                var novi = $('<div>' + Utils.replaceKeys(render.html(), lista[it]) + '</div>');

                novi.find('[renderIf]').each(function() {
                    var js =  $(this).attr('renderIf');
                    if (!eval(js)) $(this).remove();
                    else $(this).removeAttr('renderIf');
                });
                radneStavke.push(novi.html());
            }

            if (groupNiz.length > 0) this.append(groupNiz[groupNiz.length - 1].niz.join(''));
            else this.append(radneStavke);

            this.html(this.html().replaceAll('_src', 'src'));

            this.eInit();
        }, 

        vrednost: function (val) {

            var uc = app.vratiUserControlu(this);

            if (arguments.length == 0) {
                var vrednost = "";

                if (uc != null) return uc.vrednost();

                if (this.is('label.checkbox, label.radio, label.toggle')) vrednost = $(this).checked();

                if (this.is('.multi.select, .single.select')) vrednost =  this.find('select').val() == null ? '' :   this.find('select').val().toString();
                if (this.is('.single.select')) vrednost = vrednost.replaceAll('"', '');

                if (this.is('.select:not(.multi)') && this.is('.select:not(.single)')) vrednost = (this.find('select').length > 0 ? this.find('select').val() : $(this).val());

                if (this.is('img')) vrednost = $(this).attr('src');

                if (this.is('input:not([tip]).input, textarea:not([tip]).input, input[type="hidden"]')) vrednost = $(this).val();

                if (this.is('input.input[tip], textarea.input[tip]')) vrednost = $(this).attr('vrednost');

                if (this.is('input.input[date_picker_sql], input.input[date_picker]')) { vrednost = ($(this).val().trim() == "" ? 'NULL' :  moment($(this).val(), "DD.MM.YYYY").format("MM/DD/YYYY")) };

                if (this.is('span.input, div.input, p.input, label:not(.checkbox, .radio, .toggle)')) vrednost = $(this).text();

                if (vrednost == null) vrednost = '';

                return vrednost;
            }

            if (uc != null) return uc.vrednost(val);

            if (this.is('label.checkbox, label.radio, label.toggle')) $(this).check(val);

            if (this.is('.multi.select, .single.select')) $(this).find('select').val(val.replace('[', '').replace(']', '').split(',')).trigger('change');

            if (this.is('.select:not(.multi)') && this.is('.select:not(.single)')) $(this).find('select').val(val); if ($(this).is('select')) $(this).val(val);

            if (this.is('img')) $(this).attr('src', val);

            if (this.is('input:not(tip).input, input[type="hidden"], textarea.input' )) $(this).val(val);

            if (this.is('input.input[tip]')) {
                if (this.attr('tip') == 'broj') $(this).val(Utils.numformat(val, this.attr('format'), ',', '.'));
                $(this).attr('vrednost', val);
            }
            if (this.is('span.input, div.input, p.input, label:not(.checkbox, .radio, .toggle)')) $(this)[0].innerText = val;

            if (this.is('[multiline]')) this.trigger('keyup');

            this.izlaz();
        },

        vrednostDB : function() {

            return this.attr('old_val');
        },

        obavezan: function (val) {

            if (arguments.length == 0) {
                if (this.is('select')) return (this.parent().attr('obavezan') != null);
                return (this.attr('obavezan') != null);
            }

            this.each(function () {
                vr = ($(this).attr('obavezan') != null);
                if (vr == val) return;

                if (val) {
                    $(this).attr('obavezan', '');
                    $(this).addMark('obavezan', true);
                    return;
                }

                $(this).removeAttr('obavezan');
                $(this).removeMark('obavezan');
            });

            return this;
        },

        izlaz: function () {

            if (app.bezProveriValidnosti || (!this.isDBF() && !this.is('select'))) return;

            var uc = app.vratiUserControlu($(this));
            if (uc != null) if (uc.izlaz != null) { return uc.izlaz(); }

            var dbObj = this;
            if (this.is('select')) dbObj = this.parent();

            dbObj.removeErrorMark().removeValidMark().removeChangedValueMark();

            if (dbObj.obavezan() && dbObj.prazan()) { dbObj.addErrorMark('Polje je obavezno!'); return; }
            
            if (!dbObj.checkRegEx()) { dbObj.addErrorMark('Polje nije u očekivanom formatu!'); return; }

            if (app.Config.UseMark_PromenaVrednosti && (dbObj.vrednostDB() != dbObj.vrednost())) dbObj.addChangedValueMark();

            if (app.Config.UseMark_ValidInput) dbObj.addValidMark();

            if (this.is('.input[tip]')) this.vrednost(this.val());
        },

        prazan : function () {

            return (this.vrednost() == '');
        },

        validacija : function () {

            this.proveriObaveznaPolja();

            for (var it = 0; it < app.UserControls.length; it++) {

                if (app.UserControls[it].validacija != null) app.UserControls[it].validacija();
            }

            //if (!b) return b;

            for (var it = 0; it < app.ValidacionaPravila.length; it++) {

                app.ValidacionaPravila[it]();
            }

            b = (this.find('.danger').length == 0);

            return b;
        },

        heightAdjust : function() {
            this[0].style.height = "1px";
            this[0].style.height = (this[0].scrollHeight) + "px";
        }, 

        isDBF: function () {

            return (this.is(':dbf'));
        },

        adjustFormat: function (sepD, sepH) {

            if (arguments.length == 0) {
                sepD = ',';
                sepH = '.'
            }

            if (arguments.length == 1) {
                sepH = '.'
            }

            var format = this.attr('format');
            if (format == null) return;

            var vred = ''; 

            if (this.is('input')) {
                vred = Utils.numformat(this.val(), format, sepD, sepH);
                this.val(vred);
            }

            if (this.is('label')) {
                vred = Utils.numformat(this.text(), format, sepD, sepH);
                this.text(vred);
            }
            //console.log(vred);

        }

    });

    String.prototype.replaceAll = function (oldC, newC) {
        return (this.split(oldC).join(newC));
    };

    String.prototype.vratiDatum = function () {
        var datum;
        if (this.indexOf('.') > 0) {
            var dd = this.split(' ');
            if (dd.length == 1) dd[1] = "00:00";
            var d = dd[0].split('.');
            var h = dd[1].split(':');
            date = d[1] + '.' + d[0] + '.' + d[2];
            datum = new Date(d[2], d[1] - 1, d[0], h[0], h[1]);
        }
        else datum = new Date(this);

        return datum;
    }

    Array.prototype.filtriraj = function (atribut, vrednost, el) {

        if (arguments.length == 2) { el = false; }

        var povratniNiz = [];
        for (var i = 0; i < this.length; i++) {
            var obj = this[i];

            if (obj[atribut] == vrednost && el == false) {
                povratniNiz.push(obj);
            }

            if (obj[atribut] != undefined) {
                if (obj[atribut].toString().toUpperCase().indexOf(vrednost.toString().toUpperCase()) != -1 && el == true) {
                    povratniNiz.push(obj);
                }
            }
        }
        return povratniNiz;
    }

    Array.prototype.sortBy = function (instr) {

        if (this.length <= 1 || instr == "") return this;

        for (var it = 0; it < this.length; it++) {
            this[it].sortComplexValue = SortUtils.formComplexValue(instr, this[it]); 
        }

        var noviNiz = this.sort(SortUtils.sortAsComplex);

        for (var it = 0; it < noviNiz.length; it++) {
            delete noviNiz[it].sortComplexValue;
        }

        return noviNiz;
    }

    window.Utils = new CUtils();

    window.SortUtils = new CSortUtils();

    window.ULGenerator = new CULGenerator();

    window.app = new App();

})();


function downloadFileAsStream(prms, virtualPath) {

    // u opstem slucaju dovoljno je pozvati funkciju bez parametara
    // ako je potrebno proslediti neki poseban parametar na serverside, moze se pozvati funkcija kao u primeru
    // var p = {}; p.parametar = vrednost; downloadFile(p); 

    if (arguments.length == 0) prms = {};

    prms.DownloadFileAsStream = 1;
    ajaxPost(prms, function (result) {

        var url = (virtualPath + '/Stampa/').replace('//', '/') + result.split('|')[1];
        var params = {};
        params.byte_guid = result.split('|')[0];
        params.file_name = result.split('|')[1];
        post(url, params, '_blank');
    });
}

function post(path, params, location) {

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", path);
    if (arguments.length >=2 ) form.setAttribute("target", location);

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

function ajaxPost(mData, mSuccess, mError, mSls, event) {

    if (event != null) event.preventDefault();
    if (arguments.length == 1) mSuccess = obavesti;
    if (arguments.length == 2) mError = 'Greška!';
    if (arguments.length == 3) mSls = true;


    if (mData.toString().indexOf('FormData') > 0) {
        $.ajax({
            type: "POST",
            contentType: false,
            processData: false,
            data: mData,
            success: function (result) {
                mSuccess(result);
            },
            error: function (jqXHR, textStatus, str) {
                notify({ 'rezultat': 0, 'poruka': "Greška pri podizanju fajlova." });
            }
        });
        return;
    }

    $.ajax({
        type: "POST",
        data: mData,
        sls: mSls,
        success: function (result) {
            if (result != '') mSuccess(result);
        },
        error: function (jqXHR, textStatus, str) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(str);
            mError();
        }
    });
}

function obavesti(result) {
    result = JSON.parse(result)[0];
    notify(result);
}

$.ajaxSetup ({
    sls: false,
    loading: false
});

$(document).ajaxSend(function (event, r, settings) {
    if (settings.sls) {

        settings.loading = true;
        setTimeout(function () {
            if (settings.loading) popup()
        }, 1000);
        //showLoadingSign();
    }
});

$(document).ajaxComplete(function (event, r, settings) {

    if (settings.sls) popupHide()
    settings.loading = false;
});

function goToTopButton() {
    var offset = 520;
    var duration = 500;
    $(window).scroll(function () {
        if ($(this).scrollTop() > offset) {
            $('.back-to-top').fadeIn(duration);
        } else {
            $('.back-to-top').fadeOut(duration);
        }
    });

    $('.back-to-top').click(function (event) {
        event.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, duration);
        return false;
    })
}

function popupHide() {

    $('body > form.form_modal:visible').last().find('.modal-close').trigger('click');
}

function popup(onExit) {

    $('body').append($('.modal_container.invisible').html());
    $('html').css('overflow', 'hidden');
    var container = $('body').children().last();
    container.attr('id', 'form_modal' + $('form.form_modal:visible').length);
    var modalRB = $('.modal_inner_container:visible').length - 1;
    container.css('z-index', modalRB + 10000);
    container.find('.modal-bg').css('opacity', '0.8');

    var content = $('.modal-wrap').last().find('.modal-content');
    content.css('max-width', (90 - 5 * modalRB).toString() + '%');

    content.find('.modal-close').click(function () {

        if (onExit != undefined) if (!onExit()) return;

        var content = $(this).parents().filter('.modal-content');
        var container = content.parents().filter('.form_modal');
        $('[vezanZa="' + container.attr('id') + '"]').addClass('flipOutY animated');

        window.setTimeout(function () {

            container.find('.modal-bg').css('opacity', '0');
            window.setTimeout(function () {

                $('[vezanZa="' + container.attr('id') + '"]').remove();
                container.remove();
                if ($('.modal-content:visible').length == 0) $('html').css('overflow', 'auto');
            }, 300);

        }, 500);

        content.addClass('animated bounceOutUp');
    });

    $(content).addClass('animated bounceInDown');

    window.setTimeout(function () {
        $('.modal-content').stop(true, true);
        $('.modal-content').removeClass('animated bounceInDown');
    }, 750);

    return content.find('.uc_container');
}

function vratiUCRender(container, imeUC, methodName, parametri) {

    parametri.vratiRenderUC = imeUC;
    parametri.methodName = methodName;

    ajaxPost(parametri, function (result) {

        container.html(result);
        container.parent().addClass('loaded');
    }, null, null, null);

}

function executeUCMethod(imeUC, methodName, parametri, funkcija, param) {

    if (parametri.toString().indexOf('FormData') > 0) {

        parametri.append("executeUCMethod", imeUC);
        parametri.append("methodName", methodName);
    }
    else {
        parametri.executeUCMethod = imeUC;
        parametri.methodName = methodName;
    }

    if (arguments.length == 5) {
        ajaxPost(parametri, funkcija, null, true, null);
        return;
    }

    ajaxPost(parametri, funkcija, null, null, null);

}

function notify(messageObject, options, container) {

    var opt = {};
    if (arguments.length > 1) opt = options;

    toastr.options = {
        "positionClass": "toast-center",
        "timeOut": 0,
        "timeOut": 2000,
        "extendedTimeOut": 1000
    }

    //toastr.options.onHidden = funkcija;

    if (messageObject.rezultat == 0) toastr.success(messageObject.poruka, '', opt);
    if (messageObject.rezultat == -1) toastr.error(messageObject.poruka, '', opt);
    if (messageObject.rezultat == 1) toastr.info(messageObject.poruka, '', opt);
    if (messageObject.rezultat == 2) toastr.warning(messageObject.poruka, '', opt);

    if (container != undefined) $(container).append($('#toast-container'));

}

function showContextMenu(e, el, container) {

    if (!$('body').hasClass('context_menu_active')) {
        $('body').addClass('context_menu_active');
        $('body').append(container.html());
    }

    var cMenu = $('.context_menu').last();
    cMenu.hide();
    cMenu.css('position', 'absolute');
    cMenu.css('top', e.pageY);
    cMenu.css('left', e.pageX);
    cMenu.fadeIn(400);

    if (!e) e = window.event;
    e.stopPropagation();
}

function contextMenuListener(el, container) {
    var attFn = function (e) {

        $(this).trigger('click');
        showContextMenu(e, this, container);

        event.preventDefault();
        return false;
    };

    if (el.addEventListener) el.addEventListener("contextmenu", attFn);
    else el.attachEvent("oncontextmenu", attFn);
}

function showPropertyPanel(panel, hide) {

    if (hide) {
        panel.remove();
        return;
    }

    var prethodni = $('body > .propertyPanel:visible').length;
    var oPrethodni = $('.propertyPanel.panel' + prethodni);
    var sadasnji = prethodni + 1;
    $('body').append(panel.clone(true, true));
    cpanel = $('body > .propertyPanel').last().addClass('animated flipInY');
    cpanel.addClass('panel' + sadasnji);
    if (sadasnji > 1) cpanel.css('top', sadasnji * 20 + '%');
    if ($('form.form_modal:visible').length > 0) cpanel.attr('vezanZa', $('form.form_modal:visible').last().attr('id'));
    else cpanel.attr('vezanZa', 'document');
    initEvents(cpanel);
    cpanel.draggable();
}

function vratiSirinuSlike(x, y, maxWidth) {

    var windowRatio = window.innerWidth / window.innerHeight;
    var picRatio = x / y;
    var scWidth = Math.ceil(window.innerWidth * maxWidth);
    if (picRatio < windowRatio) scWidth = (window.innerHeight * maxWidth) * picRatio;
    return scWidth
}

function RadioButtonGroup(el, niz, lblTmplt) {

    this.tip = 'RadioButtons';

    this.$el = $(el);

    this.options = niz;

    if (arguments.length == 2) lblTmplt = '<label class="radio" val="!id!"><span></span>!naziv!</label>';
    if (arguments.length < 3 && this.$el.find('label.radio.template').length > 0) lblTmplt = this.$el.find('label.radio.template')[0].outerHTML.replace('template', '');
    this.label = lblTmplt;

    this.init = function () {

        this.$el.html('');

        for (it = 0; it < niz.length; it++) {
            var s = Utils.replaceKeys(this.label, niz[it]);
            this.$el.append(s);
        }

        this.$el.find('label.radio').click(function () {
            if ($(this).attr('disabled') == 'disabled' || $(this).hasClass('disabled')) return;
           $(this).parent().find('label.radio').removeClass('checked');
           if ($(this).parent().hasClass('danger')) $(this).parent().removeErrorMark();
           $(this).addClass('checked');
           $(this).parent().izlaz();
       });

       this.$el.eInit();
    }

    this.init();

    this.daLiJeObjekatOvogTipa = function (obj) {

        return $(obj).hasClass('radio_grupa');
    };

    this.vrednost = function (v) {

        if (arguments.length == 0) {
            var val = this.$el.find('label.radio.checked');
            if (val.length == 0) return "";
            else return val.attr('val');
        }

        this.$el.find('label.radio').removeClass('checked');
        this.$el.find('label.radio[val="' + v + '"]').trigger('click');
        return this;
    }

    this.addErrorMark = function () {

        //this.$el.addErrorMark("Nije bas sve kako treba");
        this.$el.addClass('danger');
    }

    this.removeErrorMark = function () {

        this.$el.removeMark('error');
        this.$el.removeClass('danger');
        return this.$el;
    }

    app.addUserControl(this);

}

(typeof HTMLElement !== "undefined" ? HTMLElement.prototype : Element.prototype).Index = function () {
    return $(this).parent().children().index($(this));
};

var fUkloniContextMenu = function () {
        
    if (!$('body').is('.context_menu_active')) return;

    $(".context_menu_container.active").removeClass('active');
    $('body.context_menu_active > .context_menu').remove();
    $('body.context_menu_active').removeClass('context_menu_active');
};

if (document.addEventListener) document.addEventListener("click", fUkloniContextMenu);


//Funkcija za prikazivanje menija na gridu na kruzic ikonicu
function showGridMenu(e, el) {

    var el = $(el);

    if (el.parents().filter('.kolona999999.active').length > 0) {
        $('.kolona999999.active').removeClass('active');
        return;
    }

    $('.kolona999999.active').removeClass('active');
    var menu = el.parent().parent().find('ul');
    if (menu.is(':visible')) { menu.hide(); return; }
    $('.context_menu:visible').hide();

    el.parents().filter('.kolona999999').addClass('active');
    menu.show();

    if (!e) e = window.event;
    e.stopPropagation();

}

function initGlavniMeni(glavniMeni) {
    if (glavniMeni.length > 0) {
        ULGenerator.initTemplates('<li idd="!id!"><a href="!url!" title="!naziv!">!naziv!</a></li>', '<ul idd="!id!">');
        ULGenerator.GenerateUL($('#main_menu'), glavniMeni, false);
    }
}

function info_window(el) {
    if (!el.closest('.row.margin_input').hasClass('info-box-active'))  $('body .info-box-active').removeClass('info-box-active');
    el.closest('.row.margin_input').toggleClass('info-box-active');
}

function person_counter(el, znak, uzrast) {
    var ukupno = 0;
  
    el.closest('.person_counter_all').find('.person_counter input').each(function () {
        if (isNaN($(this).val()) || $(this).val() == '') $(this).val(0);
        ukupno += parseInt($(this).val());
    });
    
    if (parseInt(el.closest('.person_counter').find('input').val()) == 0 && znak == 'minus') { return; }
    if (ukupno > 89 && znak == 'plus' || (parseInt(el.closest('.person_counter').find('input').val()) >=  parseInt(el.closest('.person_counter').find('input').attr('max')) && znak == 'plus') ) { /*alert('max.');*/ return; }
    if (ukupno < 2 && znak == 'minus' || (parseInt(el.closest('.person_counter').find('input').val()) <= parseInt(el.closest('.person_counter').find('input').attr('min')) && znak == 'minus')) { /*alert('min');*/ return; }
    else {
        el.closest('.person_counter').find('input').val(znak == 'minus' ? parseInt(el.closest('.person_counter').find('input').val()) - 1 : znak == 'plus' ? parseInt(el.closest('.person_counter').find('input').val()) + 1 : parseInt(el.closest('.person_counter').find('input').val()))
    }
    if (el.closest('.person_counter').find('input').val() == 0) { $('[dbf="nosilac_osiguranja"] label.radio[val="' + uzrast + '"]').addClass('disabled').attr('disabled', 'disabled').removeClass('checked'); } else { $('[dbf="nosilac_osiguranja"] label.radio[val="' + uzrast + '"]').removeClass('disabled').removeAttr('disabled'); }
    if (uzrast == "R" && $(':dbf(broj_starijih)').val() == 0 && $(':dbf(trajanje_dana)').val() < 366 && $(':dbf(trajanje_dana)').val() != "") 
    {
        $('#date_timepicker_end').val(parseDateWithAddDays($(':dbf(trajanje_dana)').val() - 1));
        $('.datumi :dbf(trajanje_dana)').removeErrorMark();
    }
    else if (uzrast == "R" && $(':dbf(broj_starijih)').val() >= 1 && $(':dbf(trajanje_dana)').val() > 30)
    {
        if (!$(':dbf(trajanje_dana)').hasClass("danger")) $('#trajanje_dana').addErrorMark('Greška');
        notify({ 'rezultat': -1, 'poruka': "Za grupu osiguranika 'stariji' maksimalan broj dana boravka u inostranstvu je 30!" });
    } 
}

function CheckBoxGroup(el, niz, minSel) {

    this.tip = 'CheckBoxGroup';

    this.$el = $(el);

    this.options = niz;

    this.minimumOdabranih = (arguments.length < 3 ? 0 : minSel);

    if (arguments.length == 2) lblTmplt = '<label class="checkbox" val="!id!"><span></span>!naziv!</label>';
    if (this.$el.find('label.checkbox.template').length > 0) lblTmplt = this.$el.find('label.checkbox.template')[0].outerHTML.replace('template', '');
    this.label = lblTmplt;

    this.init = function () {

        this.$el.html('');

        for (it = 0; it < niz.length; it++) {
            var s = Utils.replaceKeys(this.label, niz[it]);
            this.$el.append(s);
        }

        this.$el.eInit();

        this.$el.find('label.checkbox').click(function () { $(this).parent().izlaz(); });
    }

    this.init();

    this.daLiJeObjekatOvogTipa = function (obj) {

        return $(obj).hasClass('checkBox_grupa');
    };

    this.vrednost = function (v) {

        if (arguments.length == 0) {
            var val = [];
            this.odabrani().each(function () {
                val.push($(this).attr("val"));
            });
            val = JSON.stringify(val);
            return val;
        }

        v = JSON.parse(v);
        for (var it = 0; it < v.length; it++) {

            this.$el.find('label.checkbox[val="' + v[it] + '"]').trigger('click');
        }

        return this;
    }

    this.addErrorMark = function () {

        this.$el.addMark('error');
        this.$el.addClass('dangerRedOutline danger');
    }

    this.removeErrorMark = function () {

        this.$el.removeMark('error');
        this.$el.removeClass('dangerRedOutline danger');
        return this.$el;
    }

    this.odabrani = function () {

        return this.$el.find('label.checkbox.checked');
    }

    this.brojOdabranih = function () {

        return this.odabrani().length;
    }

    this.validacija = function () {

        var b = (this.brojOdabranih() >= this.minimumOdabranih);
        if (!b) this.$el.addErrorMark('Morate odabrati minimum ' + this.minimumOdabranih + ' opcija!');

        return b;
    }

    this.izlaz = function () {

        this.removeErrorMark().removeValidMark().removeChangedValueMark();
        return;
    }

    app.addUserControl(this);

}


function validateJMBG(jmbg) {

    if (jmbg == "") return true;

    if (jmbg.length != 13) {
        return false;
    }
    var p = new Array();
    var p13 = 0;

    p[0] = (parseInt(jmbg.substr(0, 1))) * 7;
    p[1] = (parseInt(jmbg.substr(1, 1))) * 6;
    p[2] = (parseInt(jmbg.substr(2, 1))) * 5;
    p[3] = (parseInt(jmbg.substr(3, 1))) * 4;
    p[4] = (parseInt(jmbg.substr(4, 1))) * 3;
    p[5] = (parseInt(jmbg.substr(5, 1))) * 2;
    p[6] = (parseInt(jmbg.substr(6, 1))) * 7;
    p[7] = (parseInt(jmbg.substr(7, 1))) * 6;
    p[8] = (parseInt(jmbg.substr(8, 1))) * 5;
    p[9] = (parseInt(jmbg.substr(9, 1))) * 4;
    p[10] = (parseInt(jmbg.substr(10, 1))) * 3;
    p[11] = (parseInt(jmbg.substr(11, 1))) * 2;

    for (var i = 0; i < 12; i++) {
        p13 = p13 + p[i];

    }

    p13 = p13 % 11;
    p13 = 11 - p13;

    if (p13 == 11) {
        p13 = 0;

    }
    if ((p13 == 10) || (p13 != parseInt(jmbg.substr(12, 1)))) {
        return false;
    }
    else {
       
        var dan = parseInt(jmbg.substring(0, 2), 10);
        var mesec = parseInt(jmbg.substring(2, 4), 10) - 1;
        var godinapom;
        if (parseInt(jmbg.substring(4, 7)) < 800) { godinapom = 2000 + parseInt(jmbg.substring(4, 7)); }
        else { godinapom = 1000 + parseInt(jmbg.substring(4, 7)); }
        var datum = moment([godinapom, mesec, dan]).format('YYYY-MM-DD');
        var isvaliddatum = moment(datum).isValid();

        if (!isvaliddatum) return false;
        else return true;
    }
}