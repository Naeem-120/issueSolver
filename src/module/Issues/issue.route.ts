import { Router } from "express";
import { issueController } from "./issue.controller";

const route = Router();
route.post('/',issueController.createIssue)
route.get('/',issueController.getIssue);
route.get('/:id',issueController.getIssueById);
route.put('/:id',issueController.updateIssue);
route.delete('/:id',issueController.deleteIssue);

export const issueRouter = route;