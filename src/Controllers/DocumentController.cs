using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using Microsoft.SharePoint.Client;
using eDMS.Models;
using eDMS.Utils;

namespace eDMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentController : ControllerBase
    {
        private readonly IOptions<SharePointConfiguration> _sharepointConfiguration;

        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        public SecureString GetSecureString(string plainString)
        {
            if (plainString == null) return null;

            SecureString secureString = new SecureString();
            foreach (char c in plainString.ToCharArray())
            {
                secureString.AppendChar(c);
            }
            return secureString;
        }

        public async Task<object> ConnectSharePoint()
        {
            var aadAppId = _sharepointConfiguration.Value.AADAppId;
            Uri site = new Uri(_sharepointConfiguration.Value.SiteUrl);
            string user = _sharepointConfiguration.Value.Username;
            string password = _sharepointConfiguration.Value.Password;
            var web_title = ""; var list_count = 0;
            SecureString securePassword = GetSecureString(password);

            // Note: The PnP Sites Core AuthenticationManager class also supports this
            using (var authenticationManager = new AuthenticationManager(aadAppId))
            using (var context = authenticationManager.GetContext(site, user, securePassword))
            {
                context.Load(context.Web, w => w.Title, w => w.Lists);
                await context.ExecuteQueryAsync();
                
                Console.WriteLine($"Title: {context.Web.Title}");
                web_title = context.Web.Title;

                Console.WriteLine($"Lists: {context.Web.Lists}");
                list_count = context.Web.Lists.Count;
            }
            return new { web_title, list_count };
        }

        private readonly ILogger<DocumentController> _logger;

        public DocumentController(ILogger<DocumentController> logger, IOptions<SharePointConfiguration> sharepointConfiguration)
        {
            _logger = logger;
            _sharepointConfiguration = sharepointConfiguration;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(Summaries);
        }

        // GET api/document/sharepoint
        [HttpGet("sharepoint")]
        public IActionResult GetSharePoint()
        {
            try
            {
                var result = ConnectSharePoint();
                return Ok(new { Code = "200", Message = "Success", Data = result });

            }
            catch (Exception ex)
            {
                return Ok(new { Code = "500", Message = "Error happening", Data = ex });
            }
        }
    }
}
