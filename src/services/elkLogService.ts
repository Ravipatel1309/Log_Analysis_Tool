import axios from "axios";
import { LogEntry } from "@/types";

// const ELK_URL = "http://10.13.27.30:5601/internal/search/es";

// const elkClient = axios.create({
//   baseURL: ELK_URL,
//   headers: {
//     "Content-Type": "application/json",
//     "kbn-xsrf": "true",
//   },
//   auth: {
//     username: "oim_automation",
//     password: "password",
//   },
// });

export const fetchLogsFromELK = async (
  testcaseId: string
): Promise<LogEntry[]> => {
  // const requestBody = {
  //   params: {
  //     index: "oim_automation_logs*",
  //     size: 10000,
  //     sort: [
  //       { "@timestamp": "asc" },
  //       { "log.offset": "asc" },
  //     ],
  //     query: {
  //       bool: {
  //         must: [
  //           { term: { "test.trace.run_id": testcaseId } },
  //           {
  //             query_string: {
  //               query: "log.file.path:(*UILog.log* OR *test*)",
  //             },
  //           },
  //         ],
  //       },
  //     },
  //   },
  // };

  // const response = await elkClient.post("", requestBody);

  // const hits = response.data?.rawResponse?.hits?.hits || [];

  // Fetch mock data from JSON file
  try {
    const mockData = await import(`@/mockData/${testcaseId}.json`);
    const hits = mockData.default?.rawResponse?.hits?.hits || [];

    let counter = 1;

    return hits.map((hit: any) => {
      const src = hit._source;

      const log: LogEntry = {
        id: counter,
        timeStamp: src["log.timestamp"],
        logLevel: src["log.level"],
        message: src["message"],
        logClass: src["log.class"],
        testcaseId,
        jenkinsServer: src?.host?.name ?? "UNKNOWN",
        threadName: src["log.thread"],
        lineNumber: counter,
      };

      counter++;
      return log;
    });
  } catch (error) {
    console.error(`Failed to load mock data for testcase ${testcaseId}:`, error);
    return [];
  }

  // let counter = 1;

  // return hits.map((hit: any) => {
  //   const src = hit._source;

  //   const log: LogEntry = {
  //     id: counter,
  //     timeStamp: src["log.timestamp"],
  //     logLevel: src["log.level"],
  //     message: src["message"],
  //     logClass: src["log.class"],
  //     testcaseId,
  //     jenkinsServer: src?.host?.name ?? "UNKNOWN",
  //     threadName: src["log.thread"],
  //     lineNumber: counter,
  //   };

  //   counter++;
  //   return log;
  // });
};
