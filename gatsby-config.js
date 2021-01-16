/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

const graphql_server_url = process.env.MQD_GRAPHQL_SERVER_URL
//"http://localhost:3003"

module.exports = {
  siteMetadata: {
    title: `Site maquisdoc`,
    math_exos: {'url_diff': "https://maquisdoc-math.fra1.digitaloceanspaces.com/math-exos/"}
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    //{
    //  resolve: `gatsby-source-filesystem`,
    //  options: {
    //    name: `math-exos`,
    //    path: `/home/remy/Documents/maquisdoc_depots/math-exos/`,
    //    ignore: [`**/\.*`], // ignore files starting with a dot
    //  },
    //},
    `gatsby-transformer-remark`,
    `gatsby-transformer-csv`,
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    {
        resolve: `gatsby-source-graphql`,
        options: {
            typeName: "MAQUIS",
            fieldName: "maquis",
            url : graphql_server_url
        }
    }
  ],
}
