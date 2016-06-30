$(function() {
    //Customize by setting base_url to cybercom/api docker application
    base_url = "https://dev.libraries.ou.edu/api-dsl";
    //No other alterations is need to get the standard applicaiton running!
    login_url = base_url + "/api-auth/login/?next=";
    logout_url = base_url + "/api-auth/logout/?next=";
    user_task_url = base_url + "/queue/usertasks/.json?page_size=10";
    user_url = base_url + "/user/?format=json";
    prevlink=null;nextlink=null;page=0;page_size=50;searchterm="";total_pages=0;
    //set_auth(base_url,login_url);
    $("#aprofile").click(function(){activaTab('profile')})
    $("#alogout").click(function(){window.location = logout_url.concat(document.URL);})
    //load_task_history(user_task_url);
    $('#prevlink').click(function(){load_task_history(prevlink);});
    $('#nextlink').click(function(){load_task_history(nextlink);});
    Handlebars.registerHelper('json_metatags', function(context) {
                if (typeof context !== 'undefined') {
                    return JSON.stringify(context).replace(/"/g,'').replace(/\[/g,'').replace(/\]/g,'').replace(/,/g,', ');
                }else{
                    return ""
                } 
    });
    $('#user').hide()
    $('#myTab').hide()
    load_es_data();


    $(hhrgbox).change(function()
    {
        if(this.checked)
        {
            filterhide("shrg");
            filterhide("jhrg");
        }

        else
        {
            filtershow("shrg");
            filtershow("jhrg");
        }
    });

    $(shrgbox).change(function()
    {
        if(this.checked)
        {
            filterhide("hhrg");
            filterhide("jhrg");
        }

        else
        {
            filtershow("hhrg");
            filtershow("jhrg");
        }
    });
    $(jhrgbox).change(function()
    {
        if(this.checked)
        {
            filterhide("hhrg");
            filterhide("shrg");
        }

        else
        {
            filtershow("hhrg");
            filtershow("shrg");
        }
    });
   
   var g_tag=[];
   var g_data=[];
   var g_inputs=[];
    $("#sall").click(function () {
    var tags = $("tr td.tag");
    var tag = [];
    var data= [];
    var inputs = [];

    $(tags).each(function()
    {
        tag.push($(this).text().trim());
    });
    g_tag = tag;
    // console.log(tag);

    $("tr td.data").each(function()
    {
        data.push($(this).text().trim());
    });
    g_data = data;
    var temp = $(".csv");

    $(temp).each(function()
    {
        inputs.push($(this)[0]);
    });
    g_inputs = inputs;
});
    var output = [];
    var result= [];

    $("#button").click(function () {
        var tags = $("tr td.tag");
        var alldata = [];
        for(i=0; i<tags.length; i++){
            alldata.push({tag: g_tag[i], data: g_data[i], myinput: g_inputs[i]})
        }
                // console.log("hello tag push check"+alldata);
                // console.log("hello here"+alldata);


        for(i=0; i<alldata.length; i++){
            if(alldata[i].myinput.checked) {
                output.push(alldata[i]);
            }
        }
        console.log(output);
        for(i=0;i<output.length;i++)
        {
            result.push({tag:output[i].tag,data:output[i].data});
        }
    });

    $("#final").on("click",function()
    {
        // console.log(unique(result));
        JSONToCSVConvertor(unique(result),"Output",true);

    });

});//End of Document Ready

function load_es_data(){
    $('#home').empty()
    template = Handlebars.templates['tmpl-es']
    tr_tmpl=Handlebars.templates['tmpl-tres']
    $('#home').append(template({}))
    $('#submitSearch').click(function(){
        page=0;total_pages=0;
        $('#paginate-div').empty();
        $('#paginate-div-bt').empty();
        template = Handlebars.templates['tmpl-page']
        $('#paginate-div').append(template({}))
        $('#paginate-div-bt').append(template({}))
        searchterm=$('#search').val()
        search($('#search').val());
    });
    $("#search").keyup(function(event){if(event.keyCode == 13){$("#submitSearch").click();
}});

}
function search(term){
    checked_value=$('input[name=optradio]:checked').val()
    //console.log(term)
    if (checked_value=="0"){
        url = base_url + "/es/data/victoria/hearing/.json?query={'query':{'query_string':{'query':'" + term + "'}},'aggs':{'hearing_count':{'cardinality':{'field':'TAG'}}}}"
    }else if (checked_value=="1"){
        url = base_url + "/es/data/victoria/hearing/.json?query={'query':{'match':{'DATA':{'query':'" + term + "','operator':'and'}}},'aggs':{'hearing_count':{'cardinality':{'field':'TAG'}}}}"
    }else{
        url = base_url + "/es/data/victoria/hearing/.json?query={'query':{'match_phrase':{'DATA':{'query':'" + term + "','type':'phrase'}}},'aggs':{'hearing_count':{'cardinality':{'field':'TAG'}}}}"
    }
     //need to add a user element to assign the lines above and below
     if ($('#contextlines').val()==""){
        $('#contextlines').val(5)
        lines_above_below = 5;
     } else{
        lines_above_below = parseInt($('#contextlines').val());
     }
     //lines_above_below = 5;
     if (page == 0){
        $("#result_tbody").empty();
        url_param = "&page=1&page_size=" + page_size
     }else{
        url_param = "&page="+ page + "&page_size=" + page_size
    }
     $.getJSON( url + url_param ,function(data){
        //Set up pagination 
        if (page==0){
            total_pages=Math.ceil(data.hits.total/page_size)
            $('.sync-pagination').twbsPagination({
                totalPages: total_pages,
                visiblePages: 15,
                onPageClick: function (event, page_num) {
                    page=page_num;
                    if (page_num !=1){
                        if ($(".page"+page).length==0){
                            search(searchterm);
                        }
                    }
                    $('.tr-all').hide();
                    $(".page"+page).show();
                    tot_ret = data.hits.total
                    hear_total = data.aggregations.hearing_count.value
                    if ( hear_total > tot_ret ){hear_total = tot_ret;}
                    $('.page-content').text( "Search Results: " + tot_ret.toString() + "  Total Hearings:  " +  hear_total.toString() + ' --- Page ' + page_num + ' of ' + total_pages);
                }
            });
            page=1;
        }
        tr_tmpl=Handlebars.templates['tmpl-tres']
        $.each(data.hits.hits,function(itm,val){
	   content_lines(val,lines_above_below,tr_tmpl,"result_tbody",page) 
        });
        /*try {
            tot_ret = data.hits.total
            hear_total = data.aggregations.hearing_count.value
            if ( hear_total > tot_ret ){hear_total = tot_ret;}
            $('#result_nums').text("Search Results: " + tot_ret.toString() + "  Total Hearings:  " +  hear_total.toString() );
        }catch(e){
            console.log(e);
        }*/
     });
}
function content_lines(val,lines,templ,html){
     lowEnd= parseInt(val._id) - lines;
     highEnd = parseInt(val._id) + lines;
     list = [];
     for (var i=lowEnd;i<=highEnd;i++){list.push(i);}
     ids= list.join(",")
     url = base_url + "/es/data/victoria/hearing/.json?esaction=mget&ids="+ ids
     // console.log(ids);
     
     $.getJSON( url ,function(data){
        temp_data = ""
	$.each(data.docs,function(i,v){
	    if(v.found && v._source.TAG == val._source.TAG){

                //if(v._id == val._id){ 
                //    temp_data= temp_data + "<hr><span class='es_search'>" +  v._source.DATA + "</span><hr>";
                //}else{
	    	temp_data= temp_data + v._source.DATA + "  ";
                //}
	    }
        // console.log(temp_data);
        // temp_data="";

	}
    );
	$("#" + html).append(templ({"PAGE":"page"+page,"LINK":"/dsl-portal/htmlfiles/"+val._source.TAG+".htm","TAG":val._source.TAG,"DATA":temp_data}))
        $("#" + html).highlight($('#search').val().replace(/\"/g," ").trim().split(" "));
     });
}
function submit_user(){
    console.log(user_url)
    $.post( user_url,$('#user_form').serializeObject(),function(data){
        data.csrftoken = getCookie('csrftoken')
        $('#profile').empty();
        //source = $('#user-template').html()
        //user_template = Handlebars.compile(source);
        user_template = Handlebars.templates['tmpl-user']
        $('#profile').append(user_template(data))
        $('#user_form').hide()
        $('#view_form').show()
        $('#reset_password').click(function(){$('#pass_form').toggle(!$('#pass_form').is(':visible'));});
    })
    .fail(function(){ alert("Error Occured on User Update.")});
    //$('#user_form').hide()
    //$('#view_form').show()
    //var formData = JSON.parse($("#user_form").serializeArray());
    //console.log(formData);
    return false;
}
function edit_user(){
    $('#user_form').show()
    $('#view_form').hide()
    return false;
}
function set_password(){
    pass = $('#pass_form').serializeObject()
    if (pass.password !== pass.password2){
        alert("Passwords were not identical")
        return false;

    }
    $.post( user_url,$('#pass_form').serializeObject(),function(data){
        $('#reset_password').click(function(){$('#pass_form').toggle(!$('#pass_form').is(':visible'));});
        alert(JSON.stringify(data))
    })
    .fail(function(){ alert("Error Occured on Password Reset.")});
    return false;
}
function set_auth(base_url,login_url){
    $.getJSON( base_url + "/user/.json",function(data){
        $('#user').html(data['username'].concat( ' <span class="caret"></span> '));
        $("#user").append($('<img style="border-radius:80px;">').attr("src",data['gravator_url'] + "?s=40&d=mm") );
        data.csrftoken = getCookie('csrftoken')
        //source = $('#user-template').html()
        //user_template = Handlebars.compile(source);
        user_template = Handlebars.templates['tmpl-user']
        $('#profile').append(user_template(data))
        $('#user_form').hide()
        $('#view_form').show() 
        $('#reset_password').click(function(){$('#pass_form').toggle(!$('#pass_form').is(':visible'));});
    })
    .fail(function() {
        var slink = login_url.concat(document.URL);
        window.location = slink
    });
}
function activaTab(tab){
    $('a[href="#' + tab + '"]').tab('show')
};
function load_task_history(url){
    $.getJSON(url, function(data){
    prevlink = data.previous;
    nextlink = data.next;
    if (prevlink == null){$('#li_prevlink').addClass("disabled");} else {$('#li_prevlink').removeClass("disabled");};
    if (nextlink == null){$('#li_nextlink').addClass("disabled");} else {$('#li_nextlink').removeClass("disabled");};
    setTaskDisplay(data);
    //source = $('#tr-template').html();
    //tr_template = Handlebars.compile(source);
    tr_template = Handlebars.templates['tmpl-tr']
    $('#result_tbody').html("")//clear table
    $.each(data.results, function(i, item) {
        temp=item.task_name.split('.')
        item['task_name']= temp[temp.length-1]
        item.timestamp = item.timestamp.substring(0,19).replace('T',' ')
        $('#result_tbody').append(tr_template(item)) 
    });
    });
}
function setTaskDisplay(data){
    if (data.count <= data.meta.page_size){
        $('#task_count').text('Task 1 - ' + data.count +  ' Total ' + data.count );
    }else{
        rec_start = data.meta.page_size*data.meta.page - data.meta.page_size +1;
        rec_end = "";
        if(data.meta.page_size*data.meta.page >= data.count){
            rec_end = data.count;
        }else{
            rec_end = data.meta.page_size*data.meta.page;
        }   
        $('#task_count').text('Task ' + rec_start + ' - ' + rec_end  +  ' Total ' + data.count )
    }

}
function showResult(url){
    //myModalLabel -->title
    $.getJSON(url + ".json" , function(data){
        json_data = JSON.stringify(data,null, 4);
        $("#myModalbody").html(json_data);
        $("#myModalbody").urlize();
        $("#myModal").modal('show');
    });
}
jQuery.fn.urlize = function() {
    if (this.length > 0) {
        this.each(function(i, obj){
            // making links active
            var x = $(obj).html();
            var list = x.match( /\b(http:\/\/|www\.|http:\/\/www\.)[^ <]{2,200}\b/g );
            if (list) {
                for ( i = 0; i < list.length; i++ ) {
                    var prot = list[i].indexOf('http://') === 0 || list[i].indexOf('https://') === 0 ? '' : 'http://';
                    x = x.replace( list[i], "<a target='_blank' href='" + prot + list[i] + "'>"+ list[i] + "</a>" );
                }

            }
            $(obj).html(x);
        });
    }
};
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function filterhide(input)
    {
        $("tr td.tag").each(function() {
            if($(this).text().trim().substring(8,12) == input)
            {
                $(this).parent().hide();
            }
        });
    }

    function filtershow(input)
    {
        $("tr td.tag").each(function() {
            if($(this).text().trim().substring(8,12) == input)
            {
                $(this).parent().show();
            }
        });
    }

    function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

        var CSV = '';
        //Set Report title in first row or line

        CSV += ReportTitle + '\r\n\n';

        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = "";

            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {

                //Now convert each value to string and comma-seprated
                row += index + ',';
            }

            row = row.slice(0, -1);

            //append Label row with line break
            CSV += row + '\r\n';
        }

        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";

            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }

            row.slice(0, row.length - 1);

            //add a line break after each row
            CSV += row + '\r\n';
        }

        if (CSV == '') {
            alert("Invalid data");
            return;
        }

        //Generate a file name
        var fileName = "MyReport_";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += ReportTitle.replace(/ /g,"_");

        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension

        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function unique(origArr){
    var newArr = [],
        origLen = origArr.length,
        found, x, y;

    for (x = 0; x < origLen; x++) {
        found = undefined;
        for (y = 0; y < newArr.length; y++) {
            if (origArr[x].tag === newArr[y].tag) {
                found = true;
                break;
            }
        }
        if (!found) {
            newArr.push(origArr[x]);
        }
    }
    return newArr;
}




