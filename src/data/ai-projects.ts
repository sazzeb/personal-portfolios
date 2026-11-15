export interface AiProject {
  slug: string;
  title: string;
  description: string;
  technologies: readonly string[];
  results: readonly string[];
  repository: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  caption: string;
}

export const aiProjects: readonly AiProject[] = [
  {
    slug: "predictive-maintenance",
    title:
      "Predictive Maintenance Using Deep Learning — NASA C-MAPSS Remaining Useful Life Prediction",
    description:
      "Predicts aircraft-engine remaining useful life from multivariate sensor histories in the NASA C-MAPSS dataset. The project compares MLP, LSTM, and temporal convolutional networks to study degradation patterns and support maintenance planning.",
    technologies: ["PyTorch", "MLP", "LSTM", "TCN", "Time-series forecasting"],
    results: [
      "Saved TCN FD001 evaluation reports test RMSE of 37.96 cycles and MAE of 28.25 cycles.",
      "Exports per-engine predictions, training curves, and evaluation summaries for inspecting model errors.",
    ],
    repository:
      "https://github.com/sazzeb/Remaining-Useful-Life-Prediction-Using-the-NASA-C-MAPSS",
    image: "rul.png",
    imageWidth: 1950,
    imageHeight: 750,
    caption:
      "Actual TCN FD001 test summary exported by the project. Metrics refer to the saved evaluation run.",
  },
  {
    slug: "tennis-performance",
    title:
      "Tennis Performance Classification Using Label Distribution Learning and Weighted k-Nearest Neighbors",
    description:
      "Models tennis performance as a distribution over five performance labels rather than assigning only one class. Using ATP 2024 match statistics, the notebook compares weighted nearest-neighbor methods with label-distribution learning baselines.",
    technologies: [
      "Python",
      "Label distribution learning",
      "Weighted k-NN",
      "ATP 2024",
    ],
    results: [
      "Processes 3,016 cleaned matches into 6,032 player instances with six performance features.",
      "WkNN-LDL records 5.19% 0/1 loss in the saved comparison; SA-BFGS performs best on the separately defined error-probability measure at 16.30%.",
    ],
    repository:
      "https://github.com/sazzeb/Statistical-learning-method-4/blob/main/CSCE5215_LDL_Tennis_Fixed.ipynb",
    image: "tennis.png",
    imageWidth: 1540,
    imageHeight: 614,
    caption:
      "Actual notebook output comparing classification loss and error probability across five methods.",
  },
  {
    slug: "image-watermarking",
    title:
      "Digital Image Watermarking and Copyright Protection Using Haar Wavelet Transform",
    description:
      "Embeds a grayscale watermark inside a cover image using Haar wavelet transforms, then extracts it to verify recovery. A MATLAB application exposes embedding modes, strength controls, image comparisons, and studies of compression, cropping, and resizing.",
    technologies: [
      "MATLAB",
      "Haar wavelets",
      "Image processing",
      "PSNR",
      "SSIM",
    ],
    results: [
      "The captured Balanced-mode example reports 44.29 dB PSNR and 0.9966 block SSIM for cover-image quality.",
      "That unchanged-image example achieves exact recovery: 0.000% bit error rate and normalized correlation of 1.00000; altered-image recovery depends on the operation and settings.",
    ],
    repository:
      "https://github.com/sazzeb/Hough-Transform/tree/main/Project_CSCE_5222",
    image: "watermark.png",
    imageWidth: 1745,
    imageHeight: 768,
    caption:
      "Actual application screenshot showing cover quality and watermark recovery measurements for one example.",
  },
  {
    slug: "travelwise-recommendation-system",
    title: "Data Visualization and Travel Recommendation System — TravelWise",
    description:
      "Recommends personalized travel plans using destination, accommodation, transport, and activity datasets. The Next.js application combines budget and preference filters with maps and cost visualizations to help users compare trip options.",
    technologies: ["Next.js", "TypeScript", "Python", "SQLite", "Data visualization"],
    results: [
      "Builds ranked itinerary recommendations with estimated trip costs, budget-fit percentages, and nearby activities based on user preferences.",
      "Retains source dataset rows for recommended accommodations, activities, and routes, with a Python CLI and a server-side recommendation API. No measured recommendation-accuracy benchmark is published.",
    ],
    repository: "https://github.com/sazzeb/Data-Visualization-Recommended-System",
    image: "travelwise.svg",
    imageWidth: 1000,
    imageHeight: 560,
    caption:
      "Workflow illustration based on the repository’s implemented features; not an application screenshot or measured recommendation result.",
  },
  {
    slug: "information-retrieval",
    title:
      "C++ Information Retrieval Engine with Text Parsing, Tokenization, and Inverted Indexing",
    description:
      "Builds a document-processing and retrieval pipeline in C++ that parses TREC records, normalizes tokens, removes stopwords, and applies stemming. It creates document and term dictionaries alongside forward and inverted indexes for term lookup.",
    technologies: [
      "C++17",
      "CMake",
      "Tokenization",
      "Porter stemming",
      "Inverted indexes",
    ],
    results: [
      "Produces persisted parser output, document and term dictionaries, forward indexes, inverted postings, and lookup offsets.",
      "The committed output demonstrates term-to-document postings with term frequencies; no benchmark latency or retrieval-accuracy claim is supplied.",
    ],
    repository: "https://github.com/sazzeb/IR-Engine-Text-Parser",
    image: "ir.svg",
    imageWidth: 1000,
    imageHeight: 560,
    caption:
      "Visual rendering of the first eight lines of the repository’s actual inverted_index.txt output: term ID → document ID : frequency.",
  },
  {
    slug: "email-threat-detection",
    title:
      "Machine Learning-Based Email Threat Detection and Classification System | 2025",
    description:
      "Classifies email text into harmful, malicious, phishing, solicited, and spam categories using TF-IDF features and supervised learning. The notebook compares Naive Bayes, LinearSVC, and logistic regression, with a Django application providing a text-classification interface.",
    technologies: ["Python", "scikit-learn", "TF-IDF", "Naive Bayes", "Django"],
    results: [
      "The saved notebook reports 100% test accuracy for all three compared classifiers on its 2,080-example test split.",
      "The displayed Naive Bayes confusion matrix covers all five categories. This is a saved experimental result, not an independently validated production detection rate.",
    ],
    repository: "https://github.com/sazzeb/spam-ham-web-app",
    image: "email.png",
    imageWidth: 740,
    imageHeight: 584,
    caption:
      "Actual Naive Bayes test confusion matrix extracted from the project notebook.",
  },
  {
    slug: "automated-essay-grading",
    title:
      "Automated Essay Grading and Performance Prediction Using Machine Learning | 2025",
    description:
      "Explores automated essay scoring using readability, writing errors, lexical diversity, and cohesion features. The notebook compares Lasso and decision-tree regression across school, college, and graduate essay groups, generating predicted scores and diagnostic plots.",
    technologies: [
      "Python",
      "NLP",
      "Lasso regression",
      "Decision trees",
      "Readability analysis",
    ],
    results: [
      "Produces score predictions for 1,814 essays: 1,690 school-level, 78 college-level, and 46 graduate-level examples.",
      "Exports actual-versus-predicted score plots and model comparisons. Saved decision-tree test R² values are negative for the college and graduate groups, indicating that further model validation and improvement are needed.",
    ],
    repository: "https://github.com/sazzeb/grading-system",
    image: "grading.png",
    imageWidth: 4170,
    imageHeight: 1459,
    caption:
      "Actual college-level Lasso prediction plot exported by the grading project.",
  },
];
