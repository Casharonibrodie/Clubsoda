import { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import { Link, useNavigate} from 'react-router-dom';
import '../../styles/contact-page.css';
import axios from 'axios';

function ContactPageForm() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const [formDetails, setFormData] = useState({
      businessName: '',
      name: '',
      email: '',
      phone: '',
      website: '',
      hearAbout: '',
      formData: {
        category: [],
        budget: '',
        start:'',
        aboutYourself: '',
        aboutGoals: '',
        competitors:'',
        helpContent:'yes',
        projectType:'',
      }
    });
    

    useEffect(() => {
      fetch("https://clubsoda.io/wp-backend/wp-json/wp/v2/pages/192")
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }, [])


    const validateStep1 = () => {
      const errors = {};
      if (formDetails.formData.category.length === 0) {
        errors.category = 'Please select at least one category.';
      }
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    };
    

  const validateStep2 = () => {
    const errors = {};
    if (!formDetails.formData.budget) {
      errors.budget = 'Please select a Budget.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = () => {
    const errors = {};
    if (!formDetails.formData.start) {
      errors.start = 'Please enter when you want to start.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep4 = () => {
    const errors = {};
    if (!formDetails.formData.aboutYourself.trim()) {
      errors.aboutYourself = 'This field is required.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep5 = () => {
    const errors = {};
    if (!formDetails.formData.aboutGoals.trim()) {
      errors.aboutGoals = 'This field is required.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const validateStep7 = () => {
    const errors = {};
    if (!formDetails.formData.helpContent) {
      errors.helpContent = 'Please select an option.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep8 = () => {
    const errors = {};
    if (!formDetails.formData.projectType) {
      errors.projectType = 'Please select a project type.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep9 = () => {
    const errors = {};
    if (!formDetails.businessName.trim()) {
      errors.businessName = 'Business name is required.';
    }
    if (!formDetails.name.trim()) {
      errors.name = 'Your name is required.';
    }
    if (!formDetails.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formDetails.email)) {
      errors.email = 'Invalid email format.';
    }
    if (!formDetails.phone.trim()) {
      errors.phone = 'Phone number is required.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    let isValid = true;
    if (currentStep === 1) isValid = validateStep1();
    if (currentStep === 2) isValid = validateStep2();
    if (currentStep === 3) isValid = validateStep3();
    if (currentStep === 4) isValid = validateStep4();
    if (currentStep === 5) isValid = validateStep5();
    if (currentStep === 7) isValid = validateStep7();
    if (currentStep === 8) isValid = validateStep8();

    if (isValid) {
      setValidationErrors({});
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setValidationErrors({});
    setCurrentStep((prev) => prev - 1);
  };

  const handleFormSubmit = async () => {
    if (!validateStep9()) return;

  
    try {
      const response = await axios.post(
        'https://clubsoda.io/wp-backend/wp-json/form-submission/v1/submit/contact',
        formDetails,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Server Response:', response.data);
      navigate('/submission-confirmation');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleCategorySelection = (option) => {
    setFormData((prev) => {
      const updatedCategory = prev.formData.category.includes(option)
        ? prev.formData.category.filter((item) => item !== option) // Remove if already selected
        : [...prev.formData.category, option]; // Add if not selected
  
      return {
        ...prev,
        formData: { ...prev.formData, category: updatedCategory },
      };
    });
  };
  
  
  
  if (loading) {
    return <div></div>;
  }

  if (!data) {
    return <div>Error loading data</div>;
  }

const acf = data.acf;


  return (
    <div className="contact-form-background">
      <div className="contact-nav-wrapper">
        <div className="contact-nav-header">
          <Link to="/">
            <div className="contact-logo"
            style={{
              backgroundImage: `url('https://clubsoda.io/wp-backend/wp-content/uploads/2025/01/clubsoda_logo.png')`,
            }}
            ></div>
          </Link>
          <div className="contact-nav-form-text">
            <h2>{parse(acf.contact_header.contact_banner_text)}</h2>
          </div>
        </div>
      </div>
      <div className="contact-form">
        <div className="contact-form-wrapper">

{/* first form section*/}

{currentStep === 1 && (
  <>
    <div className="contact-form-back">
      <Link to="/contact">← Back</Link>
    </div>
    <div className="contact-form-choice">
      <h3>{parse(acf.contact_form_step_1.contact_form_step_1_question)}</h3>
      <div className="contact-form-choices contact-form-step-1">
            {acf.contact_form_step_1.contact_form_step_1_options.map((option) => (
              <button
                key={option.option_title}
                onClick={() => handleCategorySelection(option.option_title)}
                className={formDetails.formData.category.includes(option.option_title) ? 'selected' : ''}
                aria-pressed={formDetails.formData.category.includes(option.option_title)}
              >
                {option.option_title}
              </button>
      ))}
      </div>
    </div>
    {validationErrors.category && (
      <p className="validation-error">{validationErrors.category}</p>
    )}
    <div className="contact-form-next contact-form-next-1">
      <span>
        <Link to='/recruit'>*SEEKING REPRESENTATION or collaboration? VISIT RECRUIT PAGE</Link>
        <img src="/assets/open.svg"></img>
      </span>
      <button onClick={handleNext}>
        Next →
      </button>
    </div>
  </>
)}

{/* second form section*/}

{currentStep === 2&&(
  <>
    <div className="contact-form-back">
      <button onClick={handleBack}>← Back</button>
    </div>
    <div className="contact-form-choice">
    <h3>{parse(acf.contact_form_step_2.contact_form_step_2_question)}</h3>
      <div className="contact-form-choices">
      {acf.contact_form_step_2.contact_form_step_2_options.map((option) => (
        <button
          key={option.option_title}
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              formData: { ...prev.formData, budget: option.option_title },
            }))
          }
          className={formDetails.formData.budget === option.option_title ? 'selected' : ''}
        >
          {option.option_title}
        </button>
      ))}
      </div>
    </div>
    {validationErrors.budget && (
      <p className="validation-error">{validationErrors.budget}</p>
    )}
    <div className="contact-form-next">
      <button onClick={handleNext}>
        Next →
      </button>
    </div>
  </>
)}

{/* third form section*/}

{currentStep === 3&&(
  <>
    <div className="contact-form-back">
      <button onClick={handleBack}>← Back</button>
    </div>
    <div className="contact-form-choice">
    <h3>{parse(acf.contact_form_step_3.contact_form_step_3_question)}</h3>
      <div className="contact-form-choices">
      {acf.contact_form_step_3.contact_form_step_3_options.map((option) => (
        <button
          key={option.option_title}
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              formData: { ...prev.formData, start: option.option_title },
            }))
          }
          className={formDetails.formData.start === option.option_title ? 'selected' : ''}
        >
          {option.option_title}
        </button>
      ))}
      </div>
    </div>
    {validationErrors.start && (
      <p className="validation-error">{validationErrors.start}</p>
    )}
    <div className="contact-form-next">
      <button onClick={handleNext}>
        Next →
      </button>
    </div>
  </>
)}


{/* fourth form section*/}

{currentStep === 4 && (
  <>
    <div className="contact-form-back">
      <button onClick={handleBack}>← Back</button>
    </div>
    <div className="contact-form-choice">
      <h3 style={{ marginBottom: 0 }}>{parse(acf.contact_form_step_4.step_4_heading)}</h3>
      <p>{parse(acf.contact_form_step_4.step_4_label)}</p>
      <textarea
        className='textarea-input'
        value={formDetails.formData.aboutYourself} 
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            formData: { ...prev.formData, aboutYourself: e.target.value },
          }))
        } 
        rows="8"
        style={{ width: '100%', padding: '10px', borderRadius: '8px', marginTop: '64px' }}
      />
    </div>
    {validationErrors.aboutYourself && (
      <p className="validation-error">{validationErrors.aboutYourself}</p>
    )}
    <div className="contact-form-next">
      <button onClick={handleNext}>
        Next →
      </button>
    </div>
  </>
)}

{/* fifth form section*/}

{currentStep === 5 && (
  <>
    <div className="contact-form-back">
      <button onClick={handleBack}>← Back</button>
    </div>
    <div className="contact-form-choice">
      <h3 style={{ marginBottom: 0 }}>{parse(acf.contact_form_step_5.step_5_heading)}</h3>
      <p>{parse(acf.contact_form_step_5.step_5_label)}</p>
      <textarea
        className='textarea-input'
        value={formDetails.formData.aboutGoals} 
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            formData: { ...prev.formData, aboutGoals: e.target.value },
          }))
        } 
        rows="8"
        style={{ width: '100%', padding: '10px', borderRadius: '8px', marginTop: '64px' }}
      />
    </div>
    {validationErrors.aboutGoals && (
      <p className="validation-error">{validationErrors.aboutGoals}</p>
    )}
    <div className="contact-form-next">
      <button onClick={handleNext}>
        Next →
      </button>
    </div>
  </>
)}

{/* sixth form section*/}

{currentStep === 6 && (
  <>
    <div className="contact-form-back">
      <button onClick={handleBack}>← Back</button>
    </div>
    <div className="contact-form-choice">
      <h3 style={{ marginBottom: 0 }}>{parse(acf.contact_form_step_6.step_6_heading)}</h3>
      <p>{parse(acf.contact_form_step_6.step_6_label)}</p>
      <textarea
        className='textarea-input'
        value={formDetails.formData.competitors} 
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            formData: { ...prev.formData, competitors: e.target.value },
          }))
        } 
        rows="8"
        style={{ width: '100%', padding: '10px', borderRadius: '8px', marginTop: '64px' }}
      />
    </div>
    <div className="contact-form-next">
      <button onClick={handleNext}>
        Next →
      </button>
    </div>
  </>
)}

{/* seventh form section*/}

{currentStep === 7 && (
  <>
    <div className="contact-form-back">
      <button onClick={handleBack}>← Back</button>
    </div>
    <div className="contact-form-choice">
      <h3 style={{ marginBottom: 0 }}>{parse(acf.contact_form_step_7.step_7_heading)}</h3>
      <p>{parse(acf.contact_form_step_7.step_7_label)}</p>
      <div className="contact-radio-button">
        {/* Radio Button for "Yes" */}
        <label>
          <input
            type="radio"
            name="helpContent"
            value="yes"
            checked={formDetails.formData.helpContent === 'yes'}
            onChange={(e) => {
              console.log('Radio selected:', e.target.value);
              setFormData((prev) => ({
                ...prev,
                formData: { ...prev.formData, helpContent: e.target.value },
              }));
            }}
          />
          Yes
        </label>

        {/* Radio Button for "No" */}
        <label>
          <input
            type="radio"
            name="helpContent"
            value="no"
            checked={formDetails.formData.helpContent === 'no'}
            onChange={(e) => {
              console.log('Radio selected:', e.target.value);
              setFormData((prev) => ({
                ...prev,
                formData: { ...prev.formData, helpContent: e.target.value },
              }));
            }}
          />
          No
        </label>
      </div>
    </div>
    {validationErrors.helpContent && (
      <p className="validation-error">{validationErrors.helpContent}</p>
    )}
    <div className="contact-form-next">
      <button onClick={handleNext}>
        Next →
      </button>
    </div>
  </>
)}

{/* eighth form section*/}

{currentStep === 8&&(
  <>
    <div className="contact-form-back">
      <button onClick={handleBack}>← Back</button>
    </div>
    <div className="contact-form-choice">
    <h3>{parse(acf.contact_form_step_8.step_8_question)}</h3>
      <div className="contact-form-choices">
      {acf.contact_form_step_8.step_8_options.map((option) => (
          <button
            key={option.step_8_options_title} // Correct key
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                formData: { ...prev.formData, projectType: option.step_8_options_title }, // Updated state key
              }))
            }
            className={formDetails.formData.projectType === option.step_8_options_title ? 'selected' : ''}
          >
            {option.step_8_options_title} {/* Correct content */}
          </button>
        ))}
      </div>
    </div>
    {validationErrors.projectType && (
      <p className="validation-error">{validationErrors.projectType}</p>
    )}
    <div className="contact-form-next">
      <button onClick={handleNext}>
        Next →
      </button>
    </div>
  </>
)}

{/* ninth form section*/}

{currentStep === 9 && (
  <>
    <div className="contact-form-back-details">
      <button onClick={handleBack}>← Back</button>
    </div>
    <div className="contact-form-details">
      <h3>{parse(acf.contact_form_step_9.step_9_heading)}</h3>
      {acf.contact_form_step_9.step_9_label.map((item, index) => {
        const placeholder = item.step_9_contact_info_labels;

        // Map each placeholder to the corresponding key in formDetails
        const placeholderKeyMap = {
          'YOUR LEGAL BUSINESS NAME': 'businessName',
          'YOUR FULL NAME': 'name',
          'YOUR PHONE NUMBER': 'phone',
          'YOUR PREFERRED CONTACT EMAIL': 'email',
          'YOUR WEBSITE (IF IT EXISTS)': 'website',
          'HOW DID YOU HEAR ABOUT CLUBSODA?': 'hearAbout',
        };

        const stateKey = placeholderKeyMap[placeholder];
        if (!stateKey) return null;

        const inputKey = `${stateKey}_${index}`;

        return (
          <div key={inputKey}>
            <input
              type={
                placeholder.includes('EMAIL')
                  ? 'email'
                  : placeholder.includes('PHONE')
                  ? 'tel'
                  : 'text'
              }
              placeholder={placeholder}
              value={formDetails[stateKey] || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [stateKey]: e.target.value,
                }))
              }
            />
            {validationErrors[stateKey] && (
              <p className="validation-error">{validationErrors[stateKey]}</p>
            )}
          </div>
        );
      })}
    </div>
    <div className="contact-form-next">
      <button onClick={handleFormSubmit}>
        <a>Submit →</a>
      </button>
    </div>
  </>
)}

        </div>
      </div>
    </div>
  );
}

export default ContactPageForm;


