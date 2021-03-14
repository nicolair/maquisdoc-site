/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

graphql_server_url = process.env.MQD_GRAPHQL_SERVER_URL
//graphql_server_url = "http://188.226.151.10:3003"
//if ( process.env.MQD_GRAPHQL_SERVER_URL ){
//    graphql_server_url = process.env.MQD_GRAPHQL_SERVER_URL
//}

console.log(graphql_server_url)

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
      }        
    },
    {
      resolve: `gatsby-plugin-apollo`,
      options: {
        uri: graphql_server_url
      }
    },
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
        //url : "http://0.0.0.0:3003"
        //url : "http://188.226.151.10:3003"
        url : graphql_server_url
        }
    }
  ],
}
