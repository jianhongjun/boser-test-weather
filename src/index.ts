#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "weather-app/1.0";

// Create server instance
const server = new McpServer({
  name: "boser_weather",
  version: "1.0.9",
  capabilities: {
    resources: {},
    tools: {},
  },
});


  



  // Register weather tools
server.tool(
  "get-weather",
  "获取某个城市的天气",
  {
    state: z.string().max(25).describe("城市全名(e.g. 上海市, 北京市)"),
  },
  getWeather
  ,
);


type ContentType = 
    | { type: "text"; text: string }
   

/**
 * 获取天气
 * @param cityName 城市名称
 * @param language 返回语言
 * @returns 天气数据或null
 */
async function getWeather({state}:{state:string}): Promise<{ content: ContentType[] }>{
    const data = {
      apiKey: "65b0edf3c1f6d84a",
      apiType: 1,
      lon: "116.397128",
      lat: "39.916527",
      locationSys: "",
      language: "zh",
      name: state,
      num: 15
    };

    const response = await fetch('http://api.bosebrowser.com/bose/weather/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      return {
        content: [
          {
            type: "text",
            text: response.status.toString(),
          },
        ],
      };
    }

    const responseText = await response.text();
    return {
      content: [
        {
          type: "text",
          text: responseText,
        },
      ],
    };
}


async function main() {
//  await getWeather({state:'上海'}).then(data=>console.log(data.content));
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});