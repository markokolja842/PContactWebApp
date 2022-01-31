using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace PContactWebApp.classes
{
    public class DAL1
    {
        public static DataSet readMultipleSets(string sql)
        {

            string connection_string = ConfigurationManager.ConnectionStrings["MyDBConnectionString"].ConnectionString.ToString();

            SqlConnection conn = new SqlConnection(connection_string);
            conn.Open();

            SqlCommand cmd = new SqlCommand("", conn);
            DataSet dt = new DataSet();
            SqlDataAdapter da;

            cmd.CommandType = CommandType.Text;
            cmd.CommandText = sql;
            da = new SqlDataAdapter(cmd);
            da.Fill(dt);
            conn.Close();
            return dt;

        }

    }
}