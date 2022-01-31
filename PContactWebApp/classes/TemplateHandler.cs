using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Text.RegularExpressions;
using System.Collections.Specialized;
namespace PContactWebApp.classes
{
    public class TemplateHandler
    {

        public static string Render(DataTable dt, string template)
        {
            string render = "";

            for (var it = 0; it < dt.Rows.Count; it++)
            {
                string newItem = template;
                newItem = Render(dt.Rows[it], template);
                render += newItem;
            }

            return render;
        }

        public static string Render(DataTable dt, string template, int rows)
        {
            string render = "";

            for (var it = 0; it < rows; it++)
            {
                if (dt.Rows.Count <= it) break;
                string newItem = template;
                newItem = Render(dt.Rows[it], template);
                render += newItem;
            }

            return render;
        }


        public static string Render(DataRow dr, string template)
        {
            string render = template;
            Regex reg;
            //= new Regex(@"!.+?!");
            MatchCollection mc;
            //= reg.Matches(template);

            //foreach (Match m in mc)
            //{
            //    string column = m.ToString().Replace("!", "");
            //    try
            //    {
            //        render = render.Replace(m.ToString(), dr[column].ToString());
            //    }
            //    catch { }
            //}

            for (var it = 0; it < dr.Table.Columns.Count; it++) { string column = dr.Table.Columns[it].ToString(); render = render.Replace("!" + column + "!", dr[column].ToString()); }

            reg = new Regex(@"#.+?#");
            mc = reg.Matches(template);

            foreach (Match m in mc)
            {
                string column = m.ToString().Replace("#", "").Replace("#", "");
                StringWriter myWriter = new StringWriter();
                try
                {
                    string decoded = HttpUtility.UrlDecode(dr[column].ToString());
                    render = render.Replace(m.ToString(), decoded);
                }
                catch { }
            }

            return render;
        }

        public static string RenderViticasti(DataRow dr, string template)
        {
            string render = template;
            Regex reg;

            MatchCollection mc;

            for (var it = 0; it < dr.Table.Columns.Count; it++) { string column = dr.Table.Columns[it].ToString(); render = render.Replace("{" + column + "}", dr[column].ToString()); }

            reg = new Regex(@"#.+?#");
            mc = reg.Matches(template);

            foreach (Match m in mc)
            {
                string column = m.ToString().Replace("#", "").Replace("#", "");
                StringWriter myWriter = new StringWriter();
                try
                {
                    string decoded = HttpUtility.UrlDecode(dr[column].ToString());
                    render = render.Replace(m.ToString(), decoded);
                }
                catch { }
            }

            return render;
        }

        public static string ParamsRender(NameValueCollection prms, string sql, string root = "")
        {
            string render = sql;

            foreach (string key in prms)
            {
                if (!key.StartsWith(root)) continue;
                string prop = key.Replace(root + "[", "").Replace("]", "");
                render = render.Replace("!" + prop + "!", Uri.UnescapeDataString(prms[key]).Replace("'", "''"));
            }

            render = render.Replace("!IDUlogovaniKorisnik!", Utils.UlogovaniKorisnik("IDClan"));

            return render;
        }

        public static string ParamsRender(List<NameValueCollection> prms, string sql, string root = "")
        {

            string render = "";
            foreach (NameValueCollection nm in prms)
            {
                render += TemplateHandler.ParamsRender(nm, sql);
            }
            return render;
        }

        public static NameValueCollection retParamsStartingWith(NameValueCollection prms, string root)
        {
            NameValueCollection newCol = new NameValueCollection();

            foreach (string key in prms)
            {
                if (!key.StartsWith(root)) continue;
                newCol.Add(key.Replace(root, ""), prms[key]);
            }
            return newCol;
        }

        public static List<NameValueCollection> retJSONFromParams(NameValueCollection prms, string root)
        {
            NameValueCollection newCol = retParamsStartingWith(prms, root);
            NameValueCollection item = retParamsStartingWith(prms, root + "[0]");
            List<NameValueCollection> retCol = new List<NameValueCollection>();

            if (item.Count == 0) return retCol;

            for (int it = 0; it < newCol.Count / item.Count; it++)
            {
                retCol.Add(retParamsStartingWith(prms, root + "[" + it.ToString() + "]"));
            }

            return retCol;
        }
    }
}