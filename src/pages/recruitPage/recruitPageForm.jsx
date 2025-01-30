import { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import { Link, useNavigate} from 'react-router-dom';
import '../../styles/recruit-page.css';
import axios from 'axios';

function RecruitPageForm() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  const [formDetails, setFormData] = useState({
      businessName: '',
      name: '',
      email: '',
      phone: '',
      website: '',
      hearAbout: '',
      formData: {
        category: '',
        option: '',
        aboutYourself: '',
        aboutGoals: ''
      }
    });
    
    const [validationErrors, setValidationErrors] = useState({});


    useEffect(() => {
      fetch("https://doctest.a2hosted.com/clubsoda/wp-backend/wp-json/wp/v2/pages/173")
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
      if (!formDetails.formData.category) {
        errors.category = 'Please select a category.';
      }
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    };
  
    const validateStep2 = () => {
      const errors = {};
      if (!formDetails.formData.option) {
        errors.option = 'Please select an option.';
      }
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    };
  
    const validateStep3 = () => {
      const errors = {};
      if (!formDetails.formData.aboutYourself.trim()) {
        errors.aboutYourself = 'This field is required.';
      }
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    };
  
    const validateStep4 = () => {
      const errors = {};
      if (!formDetails.formData.aboutGoals.trim()) {
        errors.aboutGoals = 'This field is required.';
      }
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    };
  
    const validateStep5 = () => {
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
      if (!validateStep5()) return;
  
      const endpoint =
        'https://doctest.a2hosted.com/clubsoda/wp-backend/wp-json/form-submission/v1/submit/recruit';
  
      try {
        const response = await axios.post(endpoint, formDetails, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        console.log('Server Response:', response.data);
  
        navigate('/recruit');
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };
  
    if (loading) {
      return <div></div>;
    }
  
    if (!data) {
      return <div>Error loading data</div>;
    }

  const acf = data.acf;

  const categoryKey = formDetails.formData.category
  .toLowerCase()
  .trim() 
  .replace(/[\s/]+/g, '_')
  .replace(/_+$/, '');


  const optionsKey = `${categoryKey}_option`;
  
  console.log('Category Key:', categoryKey);
  console.log('Options Key:', optionsKey);
  console.log(
    'Options Data:',
    acf.recruit_form_step_2?.[categoryKey]?.[optionsKey]
  );
  

  return (
    <div className="recruit-form-background">
      <div className="recruit-nav-wrapper">
        <div className="recruit-nav-header">
          <Link to="/">
           <div className="recruit-logo"
              style={{
                backgroundImage: `url('https://doctest.a2hosted.com/clubsoda/wp-backend/wp-content/uploads/2025/01/clubsoda_logo.png')`,
              }}
              ></div>
          </Link>
          <div className="recruit-nav-form-text">
            <h2>{parse(acf.recruit_header.recruit_banner_text)}</h2>
          </div>
        </div>
      </div>
      <div className="recruit-form">
        <div className="recruit-form-wrapper">

{/* first form section*/}

{currentStep === 1 && (
  <>
    <div className="recruit-form-back">
      <Link to="/recruit"><img src='/clubsoda/assets/back.svg'></img> Back</Link>
    </div>
    <div className="recruit-form-choice">
      <h3>{parse(acf.recruit_form_step_1.recruit_form_step_1_question)}</h3>
      <div className="recruit-form-choices">
          {acf.recruit_form_step_1.recruit_form_step_1_options.map(
            (option) => (
              <button
                key={option.option_title}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    formData: { ...prev.formData, category: option.option_title },
                  }))
                }
                className={
                  formDetails.formData.category === option.option_title
                    ? 'selected'
                    : ''
                }
                aria-pressed={
                  formDetails.formData.category === option.option_title
                }
              >
                {option.option_title}
              </button>
        ))}
      </div>
    </div>
    {validationErrors.category && (
                <p className="validation-error">{validationErrors.category}</p>
              )}
    <div className="recruit-form-next">
      <button onClick={handleNext}>
        Next →
      </button>
    </div>
  </>
)}

{/* second form section*/}

{currentStep === 2 && formDetails.formData.category !== 'General Inquiry' && (
  <>
    <div className="recruit-form-back">
      <button onClick={handleBack}><img src='/clubsoda/assets/back.svg'></img> Back</button>
    </div>
    <div className="recruit-form-choice">
      <h3>
      {
      parse(acf.recruit_form_step_2?.[categoryKey]?.[`${categoryKey}_question`])
      }
      </h3>
      <div className="recruit-form-choices">
      {acf.recruit_form_step_2?.[categoryKey]?.[optionsKey]?.map((option) => {
      const optionTitleKey = `${categoryKey}_option_title`;
      return (
          <button
            key={option?.[optionTitleKey]}
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                formData: {
                  ...prev.formData,
                  option: option?.[optionTitleKey],
                },
              }))
            }
            className={
              formDetails.formData.option === option?.[optionTitleKey]
                ? 'selected'
                : ''
            }
          >
            {parse(option?.[optionTitleKey])} 
          </button>
        );
      })}
      </div>
    </div>
    {validationErrors.option && (
                <p className="validation-error">{validationErrors.option}</p>
              )}
    <div className="recruit-form-next">
      <button onClick={handleNext}>
        Next →
      </button>
    </div>
  </>
)}


{/* third form section*/}

{currentStep === 3 && (
  <>
    <div className="recruit-form-back">
     <button onClick={handleBack}><img src='/clubsoda/assets/back.svg'></img> Back</button>
    </div>
    <div className="recruit-form-choice">
      <h3 style={{ marginBottom: 0 }}>{parse(acf.recruit_form_step_3.step_3_heading)}</h3>
      <p>{parse(acf.recruit_form_step_3.step_3_label)}</p>
      <textarea
        className='textarea-input'
        value={formDetails.formData.aboutYourself} 
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            formData: { ...prev.formData, aboutYourself: e.target.value },
          }))
        } 
        rows="7"
        style={{ width: '100%', padding: '10px', borderRadius: '8px', marginTop: '64px' }}
      />
    </div>
    {validationErrors.aboutYourself && (
                <p className="validation-error">{validationErrors.aboutYourself}</p>
              )}
    <div className="recruit-form-next">
      <button onClick={handleNext}>
        Next →
      </button>
    </div>
  </>
)}

{/* fourth form section*/}

{currentStep === 4 && (
  <>
    <div className="recruit-form-back">
     <button onClick={handleBack}><img src='/clubsoda/assets/back.svg'></img> Back</button>
    </div>
    <div className="recruit-form-choice">
      <h3 style={{ marginBottom: 0 }}>{parse(acf.recruit_form_step_4.step_4_heading)}</h3>
      <p>{parse(acf.recruit_form_step_4.step_4_label)}</p>
      <textarea
        className='textarea-input'
        value={formDetails.formData.aboutGoals} 
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            formData: { ...prev.formData, aboutGoals: e.target.value },
          }))
        } 
        rows="7"
        style={{ width: '100%', padding: '10px', borderRadius: '8px', marginTop: '64px' }}
      />
    </div>
    {validationErrors.aboutGoals && (
                <p className="validation-error">{validationErrors.aboutGoals}</p>
              )}
    <div className="recruit-form-next">
      <button onClick={handleNext}>
        Next →
      </button>
    </div>
  </>
)}

{currentStep === 5 && (
  <>
    <div className="recruit-form-back-details">
     <button onClick={handleBack}><img src='/clubsoda/assets/back.svg'></img> Back</button>
    </div>
    <div className="recruit-form-details">
      <h3>{parse(acf.recruit_form_step_5.step_5_heading)}</h3>
      {acf.recruit_form_step_5.step_5_label.map((item, index) => {
        const placeholder = item.step_5_contact_info_labels;

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
              value={formDetails[stateKey]}
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
    <div className="recruit-form-next">
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

export default RecruitPageForm;
