using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Codecool.ReactAppAntiforgery.Controllers
{
    public class LoginData
    {
        public string login { get; set; }
        public string password { get; set; }
    }

    [ApiController]
    [Route("[controller]/[action]")]
    public class CookieController : Controller
    {
        
        private IServiceProvider Services { get; set; }
        private Microsoft.AspNetCore.Antiforgery.IAntiforgery Csrf { get; set; }

        private HttpContext Context { get { return Services.GetRequiredService<IHttpContextAccessor>().HttpContext; } }
        public CookieController(IServiceProvider services, IAntiforgery antiforgery)
        {
            this.Services = services;
            this.Csrf = antiforgery;

        }

        [HttpPost]
        public IActionResult Login(LoginData loginData)
        {
            if (loginData.login == "juzek" && loginData.password == "maslo")
            {
                Context.Response.Cookies.Append("IsAuthenticated", "1");

                var tokens = this.Csrf.GetAndStoreTokens(HttpContext);
                Response.Cookies.Append("X-CSRF-TOKEN", tokens.CookieToken, new CookieOptions { HttpOnly = false });
                Response.Cookies.Append("X-CSRF-FORM-TOKEN", tokens.RequestToken, new CookieOptions { HttpOnly = false });

                return Ok(loginData.login);

            }
            else
            {
                Context.Response.Cookies.Append("IsAuthenticated", "0");
                
                return BadRequest(new { message = "Username or password is incorrect" });

            }
        }
    }
}
