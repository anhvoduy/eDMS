using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eDMS.Models
{
    public class SharePointConfiguration
    {
        public string AADAppId { get; set; }

        public string AppInfo { get; set; }
        public string SiteUrl { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }
    }
}
