!function(){var a=Handlebars.template,l=Handlebars.templates=Handlebars.templates||{};l["tmpl-es"]=a({compiler:[7,">= 4.0.0"],main:function(a,l,e,n,t){return'<div>\n<input type="text" class="form-control" name="url" id="search" />\n<button id="submitSearch">Search</button>\n<table class="table table-striped table-bordered table-condensed table-hover" id=\'estable\'>\n              <tr>\n                  <th>TAG</th>\n                  <th>DATA</th>\n              </tr>\n            <tbody id=\'result_tbody\'>\n              </tbody>\n            </table>\n</div>\n'},useData:!0}),l["tmpl-tr"]=a({compiler:[7,">= 4.0.0"],main:function(a,l,e,n,t){var s,r=null!=l?l:{},o=e.helperMissing,m="function",i=a.escapeExpression;return'<tr><td><a href="#" onclick="showResult(\''+i((s=null!=(s=e.result||(null!=l?l.result:l))?s:o,typeof s===m?s.call(r,{name:"result",hash:{},data:t}):s))+"');return false;\" >"+i((s=null!=(s=e.task_name||(null!=l?l.task_name:l))?s:o,typeof s===m?s.call(r,{name:"task_name",hash:{},data:t}):s))+"</a></td><td>"+i((s=null!=(s=e.timestamp||(null!=l?l.timestamp:l))?s:o,typeof s===m?s.call(r,{name:"timestamp",hash:{},data:t}):s))+"</td><td>"+i((e.json_metatags||l&&l.json_metatags||o).call(r,null!=l?l.tags:l,{name:"json_metatags",hash:{},data:t}))+"</td></tr>\n"},useData:!0}),l["tmpl-tres"]=a({compiler:[7,">= 4.0.0"],main:function(a,l,e,n,t){var s,r=null!=l?l:{},o=e.helperMissing,m="function",i=a.escapeExpression;return"<tr><td>"+i((s=null!=(s=e.TAG||(null!=l?l.TAG:l))?s:o,typeof s===m?s.call(r,{name:"TAG",hash:{},data:t}):s))+"</td><td>"+i((s=null!=(s=e.DATA||(null!=l?l.DATA:l))?s:o,typeof s===m?s.call(r,{name:"DATA",hash:{},data:t}):s))+"</td></tr>\n"},useData:!0}),l["tmpl-user"]=a({compiler:[7,">= 4.0.0"],main:function(a,l,e,n,t){var s,r=null!=l?l:{},o=e.helperMissing,m="function",i=a.escapeExpression;return'      <h2>User Profile</h2>\n      <div id="user_profile">\n          <div id="photo" class="col-md-2" style="width:200px ">\n            <img src="'+i((s=null!=(s=e.gravator_url||(null!=l?l.gravator_url:l))?s:o,typeof s===m?s.call(r,{name:"gravator_url",hash:{},data:t}):s))+'?s=180&d=mm"><br><br>\n            <a href="https://en.gravatar.com/" target="_blank" style="clear:both;">Profile Image</a><br><br>\n            <a id="reset_password" style="clear:both;">Reset Password</a>\n          </div>\n          <form  id="view_form" class="form-horizontal col-md-4" onsubmit="return edit_user();">\n              <div class="form-group">\n                <label class="col-md-3 control-label">Username</label>\n                  <div class="col-md-09">\n                <p class="form-control-static">'+i((s=null!=(s=e.username||(null!=l?l.username:l))?s:o,typeof s===m?s.call(r,{name:"username",hash:{},data:t}):s))+'</p>\n                </div>\n            </div>\n             <div class="form-group">\n                  <label class="col-md-3 control-label">Name</label>\n                    <div class="col-md-09">\n                  <p class="form-control-static">'+i((s=null!=(s=e.name||(null!=l?l.name:l))?s:o,typeof s===m?s.call(r,{name:"name",hash:{},data:t}):s))+'</p>\n                  </div>\n            </div>\n              <div class="form-group">\n                <label class="col-md-3 control-label">Email</label>\n                  <div class="col-md-09">\n                    <p class="form-control-static">'+i((s=null!=(s=e.email||(null!=l?l.email:l))?s:o,typeof s===m?s.call(r,{name:"email",hash:{},data:t}):s))+'</p>\n                 </div>\n             </div>\n             <button type="submit" id="form_submit" class="btn btn-default pull-right" style="margin-right:40px;">Edit</button>\n         </form>\n          <form class="col-md-4" id="user_form" onsubmit="return submit_user();">\n              <div style="display:none">\n                  <input type="hidden" name="csrfmiddlewaretoken" value="'+i((s=null!=(s=e.csrftoken||(null!=l?l.csrftoken:l))?s:o,typeof s===m?s.call(r,{name:"csrftoken",hash:{},data:t}):s))+'"/>\n             </div>\n              <div class="form-group">\n                 <label for="first_name">First Name</label>\n                  <input type="text" class="form-control" name="first_name" placeholder="John" value="'+i((s=null!=(s=e.first_name||(null!=l?l.first_name:l))?s:o,typeof s===m?s.call(r,{name:"first_name",hash:{},data:t}):s))+'">\n             </div>\n              <div class="form-group">\n                   <label for="last_name">Last Name</label>\n                    <input type="text" class="form-control" name="last_name" placeholder="Doe" value="'+i((s=null!=(s=e.last_name||(null!=l?l.last_name:l))?s:o,typeof s===m?s.call(r,{name:"last_name",hash:{},data:t}):s))+'">\n               </div>\n              <div class="form-group">\n                 <label for="email">Email address</label>\n                  <input type="email" class="form-control" name="email" placeholder="Enter email" value="'+i((s=null!=(s=e.email||(null!=l?l.email:l))?s:o,typeof s===m?s.call(r,{name:"email",hash:{},data:t}):s))+'">\n             </div>\n             <button type="submit" id="form_submit" class="btn btn-default pull-right">Update</button>\n         </form>\n         <div class="row" style="width:100%;clear:both;"></div>\n          <form class="form-inline" id="pass_form" onsubmit="return set_password();" style="display:none">\n            <div style="display:none">\n                    <input type="hidden" name="csrfmiddlewaretoken" value="'+i((s=null!=(s=e.csrftoken||(null!=l?l.csrftoken:l))?s:o,typeof s===m?s.call(r,{name:"csrftoken",hash:{},data:t}):s))+'"/>\n           </div>\n            <div class="form-group">\n             <label for="password">New Password</label>\n              <input type="password" class="form-control" name="password" placeholder="New Password">\n           </div>\n            <div class="form-group">\n             <label for="password2">Retype New Password</label>\n              <input type="password" class="form-control" name="password2" placeholder="Retype New Password">\n           </div>\n           <button type="submit" class="btn btn-default">Set Password</button>\n         </form>\n     </div>\n'},useData:!0})}();
