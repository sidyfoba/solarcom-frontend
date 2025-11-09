import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";

const groupElementsByTemplate = (elements) => {
  return elements.reduce((acc, element) => {
    const template = element.elementTemplate;
    if (!acc[template.id]) {
      acc[template.id] = {
        template,
        elements: [],
      };
    }
    acc[template.id].elements.push(element);
    return acc;
  }, {});
};

const GroupedElementsViewTest = () => {
  // Group elements by template
  const groupedElements = groupElementsByTemplate(elements);

  return (
    <Box sx={{ p: 2 }}>
      {Object.values(groupedElements).map(({ template, elements }) => (
        <Box key={template.id} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Template: {template.templateName}
          </Typography>
          <Grid container spacing={2}>
            {elements.map((element) => (
              <Grid item xs={12} sm={6} md={4} key={element.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{element.elementName}</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">
                      ID: {element.elementId}
                    </Typography>
                    <Typography variant="body2">
                      Values:{" "}
                      {element.values.map((v, i) => (
                        <span key={i}>
                          {v.value}
                          {i < element.values.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default GroupedElementsViewTest;
