import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@Getter
@Setter
@Document(collection = "form_templates")
public class FormTemplate {
    @Id
    private String id;
    private String templateName;
    private List<FormField> fields;
}

@NoArgsConstructor
@Getter
@Setter
public class FormField {
    private String name;
    private String type; // e.g., String, Number, Date, Select
    private List<String> options; // For Select fields
}


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/form-templates")
public class FormTemplateController {

    @Autowired
    private FormTemplateService formTemplateService;

    @PostMapping
    public FormTemplate createFormTemplate(@RequestBody FormTemplate formTemplate) {
        return formTemplateService.saveFormTemplate(formTemplate);
    }
}

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FormTemplateService {

    @Autowired
    private FormTemplateRepository formTemplateRepository;

    public FormTemplate saveFormTemplate(FormTemplate formTemplate) {
        return formTemplateRepository.save(formTemplate);
    }
}
