using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Data;
using System.Text;
using System.IO;
using System.Data.SqlClient;
using System.Configuration;
using System.Net.Mail;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Collections.Specialized;
using System.Text.RegularExpressions;

using PContactWebApp.classes;
/// <summary>
/// Summary description for Utils
/// </summary>
/// 
public static class Utils
{

    public static string renderDtToJason(DataTable dt)
    {
        System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
        List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
        Dictionary<string, object> row;
        foreach (DataRow dr in dt.Rows)
        {
            row = new Dictionary<string, object>();
            foreach (DataColumn col in dt.Columns)
            {

                TypeCode yourTypeCode = Type.GetTypeCode(col.DataType);
                bool num = false; bool b = false;
                switch (yourTypeCode)
                {
                    case TypeCode.Byte:
                    case TypeCode.SByte:
                    case TypeCode.Int16:
                    case TypeCode.UInt16:
                    case TypeCode.Int32:
                    case TypeCode.UInt32:
                    case TypeCode.Int64:
                    case TypeCode.UInt64:
                    case TypeCode.Single:
                    case TypeCode.Double:
                    case TypeCode.Decimal:
                        num = true;
                        break;
                    default:    // TypeCode.DBNull, TypeCode.Char and TypeCode.Object
                        if (yourTypeCode == TypeCode.Boolean) b = true;
                        num = false;
                        break;
                }

                row.Add(col.ColumnName, num ? dr[col].ToString().Replace(',', '.') : b ? dr[col].ToString().ToLower() : dr[col].ToString());
            }
            rows.Add(row);
        }
        return PrevediStranu(serializer.Serialize(rows));
    }

    public static string PrevediStranu(string lIndependendPage)
    {

        if (ConfigurationManager.AppSettings["AplikacijaSePrevodi"] == "0") return lIndependendPage;

        string tmp = lIndependendPage.Replace("#@", "#@" + Environment.NewLine);
        string translatedPage = lIndependendPage;
        string match, IDJezik = HttpContext.Current.Session["IDJezik"] == null ? "1" : HttpContext.Current.Session["IDJezik"].ToString() ;
        NameValueCollection lDItems = new NameValueCollection();

        Regex reg = new Regex(@"@@.*#@");
        MatchCollection mc = reg.Matches(tmp);

        if (mc.Count == 0) return translatedPage;
        if (IDJezik == "1") return (translatedPage.Replace("@@", "").Replace("#@", ""));

        lDItems = loadMissingItems(mc, IDJezik);

        foreach (Match m in mc)
        {
            match = Regex.Unescape(m.ToString().Replace("@@", "").Replace("#@", "").Replace("\\\"", "\""));
            if (lDItems[match] != null) translatedPage = translatedPage.Replace("@@" + match + "#@", lDItems[match]);
        }

        return translatedPage;
    }

    private static NameValueCollection loadMissingItems(MatchCollection mc, string IDJezik)
    {
        string match;
        string missingItems = "";
        NameValueCollection lDItems = new NameValueCollection();

        if (!Regex.IsMatch(IDJezik, @"^\d+$")) return lDItems;

        foreach (Match m in mc)
        {
            match = m.ToString().Replace("@@", "").Replace("#@", "");

            match = "N'" + match.Replace("'", "''") + "'";
            missingItems += (missingItems == "" ? "" : ", ") + match;
        }

        string sql = "SELECT ID, Stavka, Prevod FROM tPrevodiStavke WHERE IDSifarnik = 0 AND IDJezik = " + IDJezik + " AND Stavka in (" + missingItems + ")";
        DataTable dt = DAL1.readMultipleSets(sql).Tables[0];

        foreach (DataRow row in dt.Rows) lDItems.Add(row["Stavka"].ToString(), row["Prevod"].ToString());

        return lDItems;
    }

    public static string ToFriendlyURL(this string title, bool convertToLowerCase = false, char replacementChar = '-')
    {
        if (title == null)
        {
            return string.Empty;
        }

        const int Maxlen = 80;
        int len = title.Length;
        bool prevdash = false;
        var sb = new StringBuilder(len);

        for (int i = 0; i < len; i++)
        {
            char c = title[i];
            if ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9'))
            {
                sb.Append(c);
                prevdash = false;
            }
            else if (c >= 'A' && c <= 'Z')
            {
                if (convertToLowerCase)
                {
                    // tricky way to convert to lowercase
                    sb.Append((char)(c | 32));
                }
                else
                {
                    sb.Append(c);
                }
                prevdash = false;
            }
            else if (c == ' ' || c == ',' || c == '.' || c == '/' || c == '\\' || c == '-' || c == '_' || c == '=')
            {
                if (!prevdash && sb.Length > 0)
                {
                    sb.Append(replacementChar);
                    prevdash = true;
                }
            }
            else if ((int)c >= 128)
            {
                int prevlen = sb.Length;
                sb.Append(RemapInternationalCharToAscii(c));
                if (prevlen != sb.Length)
                {
                    prevdash = false;
                }
            }

            if (i == Maxlen)
            {
                break;
            }
        }

        if (prevdash)
        {
            return sb.ToString().Substring(0, sb.Length - 1);
        }
        else
        {
            return sb.ToString();
        }
    }

    public static string RemapInternationalCharToAscii(char c)
    {
        string s = c.ToString().ToLowerInvariant();
        if ("àåáâäãåa".Contains(s))
        {
            return "a";
        }
        else if ("èéêëe".Contains(s))
        {
            return "e";
        }
        else if ("ìíîïi".Contains(s))
        {
            return "i";
        }
        else if ("òóôõöøo".Contains(s))
        {
            return "o";
        }
        else if ("ùúûü".Contains(s))
        {
            return "u";
        }
        else if ("çčć".Contains(s))
        {
            return "c";
        }
        else if ("zzž".Contains(s))
        {
            return "z";
        }
        else if ("ssš".Contains(s))
        {
            return "s";
        }
        else if ("ñn".Contains(s))
        {
            return "n";
        }
        else if ("ýŸ".Contains(s))
        {
            return "y";
        }
        else if (c == 'l')
        {
            return "l";
        }
        else if (c == 'đ')
        {
            return "d";
        }
        else if (c == 'ß')
        {
            return "ss";
        }
        else if (c == 'g')
        {
            return "g";
        }
        else if (c == 'Þ')
        {
            return "th";
        }
        else
        {
            return string.Empty;
        }
    }

    public static void InitSession(DataSet ds)
    {
        HttpContext.Current.Session["Korisnik"] = ds.Tables[1].Rows[0];
        HttpContext.Current.Session["IDJezik"] = "1";
    }

    public static bool IsAdmin()
    {
        bool b = false;
        if (HttpContext.Current.Session["Korisnik"] == null) return b;
        b = (UlogovaniKorisnik("IDClan") == ConfigKey("Administrator"));
        return b;
    }

    public static bool ImaUlogu(string uloga)
    {
        if (HttpContext.Current.Session["Korisnik"] == null) return false;

        bool b = IsAdmin();
        if (b) return b;

        b = UlogovaniKorisnik("jsonUloge").IndexOf(uloga) >= 0;
        return b;
    }

    public static long VratiIDLiceUlogovanogKorisnika()
    {
        if (HttpContext.Current.Session["Korisnik"] == null) return -1;
        return Convert.ToInt64(UlogovaniKorisnik("IDClan"));
    }

    public static string UlogovaniKorisnik(string column)
    {
        if (HttpContext.Current.Session["Korisnik"] == null) return "-1";
        return ((DataRow)(HttpContext.Current.Session["Korisnik"]))[column].ToString();
    }

    public static void GlavniMeni(string IDLice = "")
    {
        if (HttpContext.Current.Session["GlavniMeni"] != null) return;

        string IDJezik = HttpContext.Current.Session["IDJezik"] == null ? "1" : HttpContext.Current.Session["IDJezik"].ToString();
        if (IDLice == "") IDLice = UlogovaniKorisnik("IDClan");

        DataSet ds = DAL1.readMultipleSets("EXEC sVratiGlavniMeni " + IDJezik + ", " + IDLice);
        HttpContext.Current.Session["GlavniMeni"] = renderDtToJason(ds.Tables[0]);
        return;
    }

    public static string EncryptPassword(string password)
    {

        MD5CryptoServiceProvider x = new MD5CryptoServiceProvider();
        byte[] pass = System.Text.Encoding.UTF8.GetBytes(password);
        pass = x.ComputeHash(pass);
        System.Text.StringBuilder s = new System.Text.StringBuilder();
        foreach (byte b in pass) { s.Append(b.ToString("x2").ToLower()); }

        return s.ToString();
    }

    private static void deletePreviousReports(string IDUlogovaniKorisnik)
    {
        string[] fileList = System.IO.Directory.GetFiles(HttpContext.Current.Server.MapPath("~") + "\\user_data\\files\\", IDUlogovaniKorisnik + "_*.xlsx");
        foreach (string file in fileList)
        {
            System.IO.File.Delete(file);
        }
    }

    //public static int sendMail(string mailSubject, string mailBody, string to, string from, string[] attachments = null, bool enableSSl = false)
    //{
    //    string odgovor = "";
    //    MailMessage mm = new MailMessage(from, to, mailSubject, Uri.UnescapeDataString(mailBody));

    //    MailAddress adresa = new MailAddress(from, from);

    //    mm.Sender = adresa;
    //    mm.From = adresa;
    //    mm.ReplyTo = adresa;

    //    if (attachments != null)
    //    {
    //        foreach (string att in attachments)
    //        {
    //            Attachment data = new Attachment(att);
    //            mm.Attachments.Add(data);
    //        }
    //    }

    //    mm.IsBodyHtml = true;
    //    SmtpClient mc = new SmtpClient();
    //    mc.EnableSsl = enableSSl;

    //    try
    //    {
    //        mc.Send(mm);
    //    }
    //    catch (Exception e)
    //    {
            
    //        DAL.Log("sendMail", VratiTekstGreske(e));
    //        return 99;
    //    }

    //    return 0;
    //}



    public static void deletePreviousReports()
    {
        string[] fileList = System.IO.Directory.GetFiles(HttpContext.Current.Server.MapPath("~") + "\\user_data\\files\\", UlogovaniKorisnik("IDLice") + "_*.xlsx");
        foreach (string file in fileList)
        {
            System.IO.File.Delete(file);
        }
    }

    public static List<KeyValuePair<string, string>> ParseQueryParameters(string wuc)
    {
        string[] uc = wuc.Split('?');
        List<KeyValuePair<string, string>> lista = new List<KeyValuePair<string, string>>();
        lista.Add(new KeyValuePair<string, string>("uc", uc[0]));

        if (uc.Length == 1) return lista;

        foreach (string itm in uc[1].Split('&'))
        {

            lista.Add(new KeyValuePair<string, string>(itm.Split('=')[0], itm.Split('=')[1]));
        }

        return lista;
    }

    public static string RenderUserControl(this Page page, string uctrlName, string methodName, string UCName)
    {

        //uctrlName = "wuc_Grid?DBID=2&ID=wuc_client&PageSize=10&ClientMode=1";
        //methodName = "InitGrid";
        List<KeyValuePair<string, string>> l = Utils.ParseQueryParameters(uctrlName);
        string ucName = l.Find(x => x.Key == "uc").Value;
        Control wc = page.LoadControl("~/user_controls/" + ucName + ".ascx");

        foreach (KeyValuePair<string, string> item in l)
        {
            if (item.Key != "uc") wc.GetType().GetProperty(item.Key).SetValue(wc, item.Value);
        }
        wc.ID = UCName;

        Type thisType = wc.GetType();
        MethodInfo theMethod = thisType.GetMethod(methodName);
        if (theMethod != null) theMethod.Invoke(wc, null);

        StringWriter sw = new StringWriter();
        Html32TextWriter writer = new Html32TextWriter(sw);
        wc.RenderControl(writer);
        writer.Close();

        return PrevediStranu(sw.ToString().Replace("/----/", (page.Request.ApplicationPath + "/").Replace("//", "/")));
    }

    public static string RenderUserControl(this UserControl uc, string uctrlName, string methodName, string UCName)
    {

        return uc.Page.RenderUserControl(uctrlName, methodName, UCName);
    }

    public static void ExecuteUCMethod(this Page page, string uctrlName, string methodName)
    {

        List<KeyValuePair<string, string>> l = Utils.ParseQueryParameters(uctrlName);
        string ucName = l.Find(x => x.Key == "uc").Value;
        Control wc = page.LoadControl(HttpContext.Current.Request.ApplicationPath + "/user_controls/" + ucName + ".ascx");

        foreach (KeyValuePair<string, string> item in l)
        {
            if (item.Key != "uc" && item.Key != "dummy") wc.GetType().GetProperty(item.Key).SetValue(wc, item.Value);
        }

        Type thisType = wc.GetType();
        MethodInfo theMethod = thisType.GetMethod(methodName);
        string response = "[{'rezultat': -1, 'poruka' : 'Ne postoji funkcija!' }]";
        if (theMethod != null) response = theMethod.Invoke(wc, ReqParamsToObjectParams(TemplateHandler.retParamsStartingWith(HttpContext.Current.Request.Params, "ucParametri"))).ToString();

        HttpContext.Current.Response.Clear();
        HttpContext.Current.Response.Write(response.Replace("/----/", (page.Request.ApplicationPath + "/").Replace("//", "/")));
        HttpContext.Current.Response.End();
    }

    public static void DownloadFile(string fullPath)
    {
        HttpContext.Current.Response.Clear();
        HttpContext.Current.Response.AddHeader("content-disposition", "attachment;filename=" + Path.GetFileName(fullPath) + "");
        HttpContext.Current.Response.ContentType = "application/" + Path.GetExtension(fullPath).Substring(1);
        HttpContext.Current.Response.WriteFile(ConfigurationManager.AppSettings["FileStorage"] + fullPath.TrimStart('/').Replace("/", "\\"));
        HttpContext.Current.Response.End();
    }

    public static void DownloadFileStream(string fileName, byte[] stream)
    {
//        int brojPolise = 138;
//        string fajl = brojPolise.ToString() + ".pdf";
//        string error;
        string g = Guid.NewGuid().ToString();
        HttpContext.Current.Session[g] = stream; // WebServicesHH.vratiPolisu(brojPolise, out error);

        HttpContext.Current.Response.Clear();
        HttpContext.Current.Response.Write(g + "|" + fileName);
        HttpContext.Current.Response.End();
    }

    public static string SetJezik(string IDJezik)
    {
        if (HttpContext.Current.Session["IDJezik"] != null) IDJezik = HttpContext.Current.Session["IDJezik"].ToString();
        else HttpContext.Current.Session["IDJezik"] = IDJezik;

        if (HttpContext.Current.Request.QueryString["defJezikPromena"] != null)
        {
            IDJezik = HttpContext.Current.Request.QueryString["defJezikPromena"].ToString();
            HttpContext.Current.Session["IDJezik"] = IDJezik;
            HttpContext.Current.Response.Redirect("//Pocetna");
        }
        return IDJezik;
    }

 


    private static object[] ReqParamsToObjectParams(NameValueCollection nmc)
    {
        object[] niz = new object[] { };
        Array.Resize(ref niz, nmc.Count);
        for (int it = 0; it < nmc.Count; it++)
        {
            niz[it] = nmc[it].ToString();
        }
        return niz;
    }
    public static string RenderSekcije(this UserControl us, string sekcije)
    {

        //DataSet ds = DAL.readMultipleSets("SELECT * FROM BO_tSekcije where idSekcija in (" + sekcije + ")");
        DataSet ds = DAL1.readMultipleSets("SELECT * FROM BO_tSekcije S  inner join dbo.BO_fSplit('" + sekcije + "', ',') SS ON S.idSekcija = SS.Vrednost where idSekcija in (" + sekcije + ") Order by ss.id");
        string html = "";

        if (ds.Tables.Count == 0) return "";

        for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
        {
            Control wc = us.LoadControl("~/user_controls/wuc_Sekcije.ascx");

        }

        return html;
    }
    public static string ConfigKey(string key)
    {
        return ConfigurationManager.AppSettings[key];
    }

    public static string SkiniPoslednjiZnakKroz(this string path)
    {
        if (path.Substring(path.Length - 1) == "\\" || path.Substring(path.Length - 1) == "/") path = path.Remove(path.Length - 1);

        return path;
    }

    public static string VratiNormalizovaniNaziv(this string fajl)
    {

        // vraca relativni naziv fajla bez app.patha, menja / u \\, sa bekslesom na prvom mestu.
        string fRelPath = HttpContext.Current.Request.ApplicationPath.Replace("/", "\\").SkiniPoslednjiZnakKroz();
        fajl = fajl.Replace("/", "\\");

        if (fRelPath != "") fRelPath = fajl.Replace(fRelPath, "");
        else fRelPath = fajl;

        return fRelPath;
    }

    public static void napravinoviSifarnik(string sadrzaj, string ime)
    {
        string filePath = "", dir = HttpContext.Current.Server.MapPath("~");
        System.IO.StreamWriter file;

        filePath = dir + "\\js\\sifarnici\\" + ime + ".js";
        if (File.Exists(filePath)) File.Delete(filePath);
        file = new System.IO.StreamWriter(filePath, false);
        file.WriteLine(sadrzaj);
        file.Close();
    }
    public static string VratiTekstGreske(Exception ex)
    {
        ex = ex.InnerException ?? ex;

        string errMsg = string.Empty;
        if (ex.Message != null) errMsg = "Message:" + ex.Message + "\r\n";
        if (ex.StackTrace != null) errMsg += "Stack Trace:" + ex.StackTrace;
        if (ex.InnerException != null && ex.InnerException.Message != null) errMsg += "InnerException Message:" + ex.InnerException.Message + "\r\n";
        if (ex.InnerException != null && ex.InnerException.StackTrace != null) errMsg += "InnerException Stack Trace:" + ex.InnerException.StackTrace + "\r\n";

        return errMsg;
    }

    public static string GetOriginFromURL(string url)
    {

        try
        {
            Uri u = new Uri(url);
            return u.Scheme + "://" + u.Authority;

        }
        catch { return "Not valid URL!"; }
    }

    public static DateTime? ToDateTime(this string s)
    {
        DateTime? dateTime = null;
        if (string.IsNullOrEmpty(s)) return null;
        int day = Convert.ToInt32(s.Split('.')[0]);
        int month = Convert.ToInt32(s.Split('.')[1]);
        int year = Convert.ToInt32(s.Split('.')[2].Split(' ')[0]);
        string vreme = s.Split('.')[2].Split(' ')[1];
        int hour = Convert.ToInt32(vreme.Split(':')[0]);
        int minutes = Convert.ToInt32(vreme.Split(':')[1]);
        int seconds = Convert.ToInt32(vreme.Split(':')[2]);
        dateTime = new DateTime(year, month, day, hour, minutes, seconds);

        return dateTime;
    }
    public static DateTime? ToDate(this string s)
    {
        DateTime? dateTime = null;
        if (string.IsNullOrEmpty(s)) return null;
        int day, month, year;
        if (s.Contains("-"))
        {
            day = Convert.ToInt32(s.Split('-')[2]);
            month = Convert.ToInt32(s.Split('-')[1]);
            year = Convert.ToInt32(s.Split('-')[0]);
        }
        else
        {
            day = Convert.ToInt32(s.Split('.')[0]);
            month = Convert.ToInt32(s.Split('.')[1]);
            year = Convert.ToInt32(s.Split('.')[2].Split(' ')[0]);
        }
        dateTime = new DateTime(year, month, day);
        return dateTime;
    }

    public static string DateTimeToSqlStringWithTime(this DateTime? d)
    {
        if (d == null) return string.Empty;
        DateTime dateTime = (DateTime)d;
        string s = dateTime.Month + "/" + dateTime.Day + "/" + dateTime.Year + " " + dateTime.Hour + ":" + dateTime.Minute + ":" + dateTime.Second;
        return s;
    }
    public static string DateTimeToSqlStringWithTime(this DateTime d)
    {
        DateTime dateTime = d;
        string s = dateTime.Month + "/" + dateTime.Day + "/" + dateTime.Year + " " + dateTime.Hour + ":" + dateTime.Minute + ":" + dateTime.Second;
        return s;
    }
    public static string DateTimeToSqlString(this DateTime d)
    {
        DateTime dateTime = d;
        string s = dateTime.Month + "/" + dateTime.Day + "/" + dateTime.Year;
        return s;
    }
}
