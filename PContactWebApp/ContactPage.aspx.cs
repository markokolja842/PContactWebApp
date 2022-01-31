using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PContactWebApp.classes;

namespace PContactWebApp
{
    public partial class ContactPage : System.Web.UI.Page
    {
        protected string podaci = "[]";
        protected string podaci1 = "[]";
        DataSet ds;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.Params["Lice"] != null) { Snimi(); return; }

            //string queryD = @"SELECT DepartmentId, DepartmentName FROM dbo.DepartmentAPI";
            string queryD = @"SELECT EmployeeZId, EmployeeZName, EmployeeZPrezime, jmbg, Department, Pol, email, Username, Passw FROM dbo.EmployeeZAPI";
            DataSet ds = DAL1.readMultipleSets(queryD);
            podaci = renderDtToJason(ds.Tables[0]);

            string queryJ = @"SELECT EmployeeZId, EmployeeZName, EmployeeZPrezime, jmbg, Department, Pol, email, Username, Passw FROM dbo.EmployeeZAPI where  EmployeeZId = 4";
            DataSet ds1 = DAL1.readMultipleSets(queryJ);
            podaci1 = renderDtToJason(ds1.Tables[0]);
        }


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
            return serializer.Serialize(rows);
        }


        public void Snimi() {
            int slanje = 1;
            //string oo = Request.Params["Podaci"];
            

            //string v = JsonConvert.SerializeObject(Request.Params["Podaci"]);
            string sql = TemplateHandler.ParamsRender(Request.Params, sql_insert_korak.InnerHtml, "Podaci");

            ds = DAL1.readMultipleSets(sql);

           string response = "{\"rezultat\" : 0, \"poruka\" : \"Uspešno  \"}";
            if (slanje == 0)
            {
                response = "{\"rezultat\" : 1, \"poruka\" : \"Neuspešno \"}";
            }

           


            Response.Clear();
            Response.Write(response);
            Response.End();

        }


    }
}