import Heading from "./Heading";
import { Box, Paper, TextField, Typography } from "@mui/material";
import { backlog } from "../data/backlogs";
import { useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ReceiptIcon from "@mui/icons-material/Receipt";
import FolderIcon from "@mui/icons-material/Folder";
import RvHookupIcon from "@mui/icons-material/RvHookup";

const backlogs = backlog["billingStatements"];

const Backlogs = () => {
	const [search, setSearch] = useState("");

	return (
		<div>
			<Heading text={"Backlogs"} />
			<TextField
				fullWidth
				type="text"
				label={"Search"}
				value={search}
				onChange={(e) => {
					setSearch(e.target.value);
				}}
				required
			/>
			<Box
				sx={{
					display: "grid",
					gap: 2,
					maxHeight: "650px",
					overflow: "auto",
					m: 2,
				}}
			>
				{backlogs
					.filter((backlog) => {
						const query = search.toLowerCase();
						return search === ""
							? true
							: backlog.bsNumber.toLowerCase().includes(query) ||
									backlog.soaNumber.toLowerCase().includes(query) ||
									backlog.containers.some((container) =>
										container.toLowerCase().includes(query),
									) ||
									backlog.associatedPdfs.some((pdf) =>
										pdf.toLowerCase().includes(query),
									);
					})
					.map((backlog, backlogIndex) => {
						return (
							<Paper
								key={"backlog - " + backlogIndex}
								elevation={2}
								sx={{ m: "2px", p: "20px", minWidth: "200px" }}
							>
								<Typography variant="h5" sx={{ fontWeight: "800" }}>
									{backlog.bsNumber}
								</Typography>
								<Box sx={{ display: "flex", alignItems: "center" }}>
									<CalendarMonthIcon />
									<Typography variant="h6" sx={{ fontWeight: "800" }}>
										{backlog.month + " " + backlog.year}
									</Typography>
								</Box>
								<Box sx={{ display: "flex", alignItems: "center" }}>
									<ReceiptIcon />
									<Typography variant="h6" sx={{ fontWeight: "800" }}>
										Associated SOAs:
									</Typography>
								</Box>
								{backlog.associatedPdfs.length > 0 ? (
									backlog.associatedPdfs.map((pdf, pdfIndex) => {
										return (
											<Typography
												key={
													"backlogContainer " +
													pdfIndex +
													" " +
													backlogIndex
												}
												sx={{
													color: "#1976d2",
													m: "2px",
													fontWeight: "800",
												}}
											>
												{pdf}
											</Typography>
										);
									})
								) : (
									<Typography sx={{ color: "red", fontWeight: "800" }}>
										Missing
									</Typography>
								)}
								<Box sx={{ display: "flex", alignItems: "center" }}>
									<FolderIcon />
									<Typography variant="h6" sx={{ fontWeight: "800" }}>
										Path:{" "}
									</Typography>
								</Box>
								{backlog.excelPath.map((path, pathIndex) => {
									return (
										<Typography
											key={pathIndex}
											display="inline"
											sx={{ fontWeight: "800", color: "#1976d2" }}
										>
											{path + " > "}
										</Typography>
									);
								})}
								<Typography
									display={"inline"}
									sx={{ fontWeight: "800", color: "#1976d2" }}
								>
									File
								</Typography>

								<Box sx={{ display: "flex", alignItems: "center" }}>
									<RvHookupIcon />
									<Typography variant="h6" sx={{ fontWeight: "800" }}>
										Containers:
									</Typography>
								</Box>
								{backlog.containers.map(
									(backlogContainer, backlogContainerIndex) => {
										return (
											<Typography
												key={
													"backlogContainer " +
													backlogContainerIndex +
													" " +
													backlogIndex
												}
												sx={{
													m: "2px",
													fontWeight: "800",
													color: backlogContainer.includes(search)
														? "#00ff00"
														: "#1976d2",
												}}
											>
												{backlogContainer}
											</Typography>
										);
									},
								)}
							</Paper>
						);
					})}
			</Box>
		</div>
	);
};

export default Backlogs;
