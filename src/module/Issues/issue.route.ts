import { Router } from "express";
import { issueController } from "./issue.controller";
import authMiddleware from "../../middleware/authMiddleware";
import { USER_ROLE } from "../../types";

const route = Router();
route.post('/',authMiddleware(),issueController.createIssue)
route.get('/', issueController.getIssue);
route.get('/:id',issueController.getIssueById);
route.put('/:id',authMiddleware(),issueController.updateIssue);
route.delete('/:id',authMiddleware(USER_ROLE.maintainer),issueController.deleteIssue);

export const issueRouter = route;