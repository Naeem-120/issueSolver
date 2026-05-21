import { config } from "../../config";
import { pool } from "../../db";
import type { TParameter } from "../../types";
import type { IIssue } from "./issue.interface";
import jwt from "jsonwebtoken";
const createIssue = async (payload: IIssue, accessToken: string) => {
  const { title, description, type } = payload;
  if (!title || !description || !type) {
    throw new Error("All fields are required");
  }
  const decodeToken = await jwt.verify(accessToken, config.jwtAccessSecret);
  if (!decodeToken) {
    throw new Error("Invalid token");
  }
  const userId = (decodeToken as any).id;
  const result = await pool.query(
    `
        INSERT INTO issues (title, description, type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING *
    `,
    [title, description, type, userId],
  );

  return result.rows[0];
};

const getAllIssues = async (payload: TParameter) => {
  const { sort = "newest", type, status } = payload;
  const result = await pool.query(`
      SELECT * FROM issues
      ${
        type && status
          ? `WHERE type = '${type}' AND status = '${status}'`
          : type
            ? `WHERE type = '${type}'`
            : status
              ? `WHERE status = '${status}'`
              : ""
      }
      order by created_at ${sort === "newest" ? "DESC" : "ASC"}
  `);

  const reporterIds = result.rows.map((issue) => {
    return issue.reporter_id;
  });
  const reporterResult = await pool.query(
    `
        SELECT id, name,role FROM users WHERE id = ANY($1)
    `,
    [reporterIds],
  );
  console.log(reporterResult.rows);

  const issueWithReporter = result.rows.map((issue) => {
    const reporter = reporterResult.rows.find((reporterDetails)=>{
        return reporterDetails.id === issue.reporter_id
    })
    return { ...issue, reporter };
  })

  return issueWithReporter;
};

//* get issue by id and include reporter details
const getIssueById = async (id: string) => {
  const result = await pool.query(
    `
        SELECT * FROM issues WHERE id = $1
    `,
    [id],
  );
  const reporterData = await pool.query(
    `
        SELECT id, name, role FROM users WHERE id = $1
    `,
    [result.rows[0].reporter_id],
  );
  const issueWithReporter = { ...result.rows[0], reporter: reporterData.rows[0] };
  return issueWithReporter;
};

const updateByRole = async( id: string, payload: IIssue) => {
      const { title, description, type } = payload;
      const result = await pool.query(
        `
            UPDATE issues 
            SET title = $1, 
            description = $2, 
            type = $3 
            WHERE id = $4 RETURNING *
        `,
        [title, description, type, id],
      );
      return result.rows[0];
}
const updateIssue = async (id: string,token: string, payload: IIssue) => {
  const decodeToken = await jwt.verify(token, config.jwtAccessSecret);
    if (!decodeToken) {
        throw new Error("Login first to update issue");
    }
    const user_id = (decodeToken as any).id;
    const role = (decodeToken as any).role;
    const issue = await pool.query(
        `
            SELECT * FROM issues WHERE id = $1
        `,
        [id],
    );
    if(role === 'contributor'&& user_id === issue.rows[0].reporter_id && issue.rows[0].status === 'open'){
        const result =await updateByRole( id, payload);
        return result;
    }
    else if(role === 'maintainer'){
        const result =await updateByRole( id, payload);
        return result;
    }
    throw new Error("You don't have permission to update this issue");
};

const deleteIssue = async (id: string) => {
  const result = await pool.query(
    `
        DELETE FROM issues WHERE id = $1 RETURNING *
    `,
    [id],
  );
  return result.rows[0];
};

export const issueService = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
};
