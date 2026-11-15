import type { AiProject } from "./ai-projects";

export interface AiProjectImage {
  file: string;
  caption: string;
  width: number;
  height: number;
}

interface AiCaseStudy {
  overview: readonly string[];
  approach: readonly string[];
  importance: readonly string[];
  future: readonly string[];
  images: readonly AiProjectImage[];
}

export const aiCaseStudies: Record<string, AiCaseStudy> = {
  "predictive-maintenance": {
    overview: [
      "Maintenance decisions depend on estimating how much useful operation remains before equipment reaches failure. This project treats engine health as a time-series regression problem, using the NASA C-MAPSS simulated turbofan degradation datasets to connect sensor observations with remaining useful life.",
      "The repository contains MLP, LSTM, and TCN implementations, saved models, per-engine predictions, and diagnostic plots. The different architectures provide ways to compare a feed-forward baseline with models that explicitly learn temporal relationships.",
    ],
    approach: [
      "Prepare sensor histories and remaining-life targets, inspecting raw signals and the effects of preprocessing.",
      "Train the neural-network architectures and inspect loss curves to understand optimization behavior.",
      "Compare predictions with held-out engine lifetimes using RMSE and MAE, alongside per-engine plots that expose overestimation and underestimation.",
    ],
    importance: [
      "Shows how sensor data can support condition-based maintenance rather than relying only on fixed service intervals.",
      "Makes prediction errors visible at the engine level, where an overly optimistic lifetime estimate can have different consequences from an early maintenance recommendation.",
      "Creates a reproducible comparison of neural architectures using a public degradation benchmark.",
    ],
    future: [
      "Add calibrated uncertainty intervals so maintenance planners can consider confidence as well as a single lifetime estimate.",
      "Evaluate generalization across operating conditions and other C-MAPSS subsets, with explicit separation of engines across training and evaluation.",
      "Explore physics-informed learning and online drift monitoring before considering use with real equipment.",
    ],
    images: [
      {
        file: "rul-training.png",
        caption: "TCN training and validation loss from the repository.",
        width: 1500,
        height: 750,
      },
      {
        file: "rul-lstm.png",
        caption:
          "LSTM test summary: another architecture evaluated in the project.",
        width: 2700,
        height: 750,
      },
    ],
  },
  "tennis-performance": {
    overview: [
      "A player’s performance can sit between categories: the same match may show strong serving but inconsistent execution elsewhere. Label distribution learning represents this ambiguity with a probability distribution across five performance labels instead of reducing every observation to one class.",
      "The notebook uses ATP 2024 statistics and six performance features, comparing AA-kNN, SA-BFGS, WkNN-LDL, LWkNN-LDL, and LDkNN-LDL. Its saved outputs compare both classification decisions and the behavior of the predicted distributions.",
    ],
    approach: [
      "Clean match statistics, construct player-level instances, and derive performance features and target label distributions.",
      "Compare neighborhood weighting strategies and distribution-learning baselines across repeated trials.",
      "Inspect classification loss, error probability, distribution similarity, and optimization convergence rather than relying on one metric.",
    ],
    importance: [
      "Preserves uncertainty and mixed performance characteristics that a hard label can conceal.",
      "Illustrates that the best method can differ by evaluation measure; classification loss and distribution quality answer different questions.",
      "Provides interpretable sports-analytics experiments based on familiar match statistics.",
    ],
    future: [
      "Test player-disjoint and chronological evaluation splits to better measure performance on unseen athletes and future matches.",
      "Study calibration and alternative target distributions to assess whether the probabilities carry useful uncertainty information.",
      "Extend the approach to other tasks with overlapping labels, such as skill assessment or multi-attribute performance analysis.",
    ],
    images: [
      {
        file: "tennis-distributions.png",
        caption:
          "Notebook convergence curves for weighted label-distribution learning.",
        width: 1420,
        height: 472,
      },
      {
        file: "tennis-analysis.png",
        caption: "Notebook comparison of predicted label distributions.",
        width: 1900,
        height: 543,
      },
    ],
  },
  "image-watermarking": {
    overview: [
      "Digital watermarking embeds an ownership signal into an image while aiming to preserve its visual quality. This project uses the Haar wavelet transform to work with image coefficients, then recovers the embedded grayscale watermark to check whether the signal survives.",
      "The MATLAB application makes the process inspectable through Create, Extract, Details, and Evaluate views. Its quality and recovery measurements distinguish how closely the watermarked image resembles the original from how accurately the hidden watermark is recovered.",
    ],
    approach: [
      "Choose cover and watermark images, prepare the watermark, and check available embedding capacity.",
      "Select embedding strength and mode, create a watermarked image, and compare extracted content with the prepared watermark.",
      "Measure PSNR and block SSIM for cover quality, BER and NCC for recovery, then study the effects of compression, cropping, and resizing.",
    ],
    importance: [
      "Demonstrates a practical signal-processing approach to ownership marking and image provenance.",
      "Makes the trade-off between imperceptibility, capacity, and recovery robustness measurable.",
      "Provides a visual experimentation environment instead of treating watermark recovery as an unexplained pass/fail result.",
    ],
    future: [
      "Compare transform-based watermarking with learned embedding and extraction models under a consistent attack benchmark.",
      "Investigate provenance signals for AI-generated media while keeping ownership marking distinct from proof of authenticity.",
      "Extend robustness studies to additional compression settings, geometric transformations, and adversarial modifications.",
    ],
    images: [
      {
        file: "watermark-create.png",
        caption:
          "Actual MATLAB Create view with image embedding and recovery previews.",
        width: 1525,
        height: 768,
      },
      {
        file: "watermark-evaluation.png",
        caption:
          "Actual application evaluation view for robustness experiments.",
        width: 1638,
        height: 768,
      },
    ],
  },
  "travelwise-recommendation-system": {
    overview: [
      "Travel planning combines several constraints: where to go, how much to spend, where to stay, and which activities fit the traveler’s interests. TravelWise brings these decisions into a recommendation workflow backed by destination, transport, accommodation, and activity datasets.",
      "The repository implements a Next.js application and server-side recommendation API, alongside a Python CLI with a SQLite indexing workflow. It exposes estimated costs and budget fit, while retaining source rows so recommendations can be traced to the underlying data.",
    ],
    approach: [
      "Collect countries, dates, traveler counts, budget settings, and preference filters.",
      "Combine accommodation, transport, and nearby activity candidates into itinerary recommendations.",
      "Expose ranked options with cost visualizations and geographic context so users can compare the trade-offs.",
    ],
    importance: [
      "Transforms heterogeneous travel datasets into a coherent decision-support experience.",
      "Makes recommendation reasoning easier to inspect through costs, budget fit, geography, and retained source records.",
      "Connects data engineering, recommendation logic, and interactive visualization in one application.",
    ],
    future: [
      "Collect consent-based feedback to evaluate recommendation relevance before introducing learned ranking.",
      "Explore multi-objective ranking that balances budget, preference coverage, travel time, and accessibility.",
      "Evaluate recommendation explanations and data freshness so future AI-assisted planning remains grounded in verifiable options.",
    ],
    images: [
      {
        file: "travelwise-ranking.svg",
        caption:
          "Explanatory ranking workflow based on repository features; not a measured result or application screenshot.",
        width: 1000,
        height: 560,
      },
    ],
  },
  "information-retrieval": {
    overview: [
      "Search systems need a reliable way to transform raw documents into structures that make term lookup possible. This C++ project implements that foundation by parsing TREC documents and building dictionaries, forward indexes, and inverted postings.",
      "The pipeline normalizes tokens, removes stopwords, and applies stemming before writing indexed output. The committed output files make the mapping between terms, documents, and frequencies inspectable without relying on a black-box retrieval service.",
    ],
    approach: [
      "Read document records and separate content from the surrounding corpus structure.",
      "Apply tokenization, lowercase normalization, stopword filtering, and stemming to construct consistent searchable terms.",
      "Persist dictionaries and indexes, then use lookup components to retrieve postings for indexed terms.",
    ],
    importance: [
      "Builds the lexical retrieval foundations used by many larger search and question-answering systems.",
      "Makes preprocessing decisions explicit, helping explain why a query term does or does not match a document.",
      "Provides reusable systems-programming components for document ingestion and indexing.",
    ],
    future: [
      "Add BM25 ranking and evaluate retrieval quality with a relevance-judged benchmark.",
      "Combine lexical retrieval with dense embeddings to study hybrid search for retrieval-augmented generation.",
      "Measure index size, build time, query latency, and result relevance as the corpus grows.",
    ],
    images: [
      {
        file: "ir-pipeline.svg",
        caption:
          "Explanatory diagram of the implemented parsing and indexing pipeline; not a benchmark result.",
        width: 1000,
        height: 560,
      },
    ],
  },
  "email-threat-detection": {
    overview: [
      "Email threat classification turns unstructured messages into categories that can support triage. This project uses text preprocessing and TF-IDF features to compare supervised classifiers across harmful, malicious, phishing, solicited, and spam labels.",
      "The repository includes experimental notebooks and a Django application for text classification. The saved experiment reports a perfect score on its own test split; that result is presented with its experimental context rather than treated as evidence of production security effectiveness.",
    ],
    approach: [
      "Prepare labeled messages and normalize textual features for the classification pipeline.",
      "Use cross-validation and parameter searches to compare Naive Bayes, LinearSVC, and logistic regression.",
      "Inspect held-out classification reports and confusion matrices, then expose classification through a web interface.",
    ],
    importance: [
      "Demonstrates an end-to-end path from text features and model selection to an accessible application.",
      "Makes category-specific errors visible, which is more informative for triage than aggregate accuracy alone.",
      "Provides a baseline for studying the distinction between ordinary unwanted content and potentially threatening messages.",
    ],
    future: [
      "Evaluate deduplicated, source-disjoint, and time-separated data to check for leakage and distribution shift.",
      "Study precision-recall trade-offs, calibration, and human review for uncertain or high-impact decisions.",
      "Compare transformer representations with the TF-IDF baseline on independently collected messages before claiming operational gains.",
    ],
    images: [
      {
        file: "email-data.png",
        caption: "Saved notebook visualization of the message dataset.",
        width: 784,
        height: 383,
      },
      {
        file: "email-analysis.png",
        caption:
          "Additional saved notebook visualization from message preprocessing.",
        width: 784,
        height: 383,
      },
    ],
  },
  "automated-essay-grading": {
    overview: [
      "Automated essay scoring studies whether measurable writing features can help estimate assessment outcomes. This notebook combines readability, writing errors, lexical diversity, and cohesion with regression models to investigate score prediction across education groups.",
      "The project compares Lasso and decision-tree predictions for school, college, and graduate essays, exporting diagnostic plots and evaluation summaries. Its negative test R² values in some groups are important limitations: generating scores is not the same as demonstrating dependable assessment quality.",
    ],
    approach: [
      "Extract writing-quality and readability features and organize essay groups by education level.",
      "Train regression models and compare predicted scores with reference scores using held-out evaluation.",
      "Inspect prediction scatterplots, feature relationships, and group-specific errors to identify where the model needs improvement.",
    ],
    importance: [
      "Connects interpretable language features with model behavior instead of producing an unexplained grade.",
      "Shows why evaluation must examine performance separately across different learner groups.",
      "Offers a research foundation for feedback tools that assist educators while leaving assessment decisions under human oversight.",
    ],
    future: [
      "Use larger, independently scored datasets and evaluate agreement with human raters across prompts and groups.",
      "Explore contextual language representations while checking whether added complexity improves generalization.",
      "Investigate rubric-aligned feedback, bias audits, and uncertainty estimates before considering consequential grading use.",
    ],
    images: [
      {
        file: "grading-tree.png",
        caption:
          "Actual college-level decision-tree prediction plot for comparison with Lasso.",
        width: 4170,
        height: 1459,
      },
      {
        file: "grading-features.png",
        caption:
          "Actual exported regression diagnostics across the project’s feature sets.",
        width: 5966,
        height: 5982,
      },
    ],
  },
};

export function getAiProjectImages(
  project: AiProject,
): readonly AiProjectImage[] {
  return [
    {
      file: project.image,
      caption: project.caption,
      width: project.imageWidth,
      height: project.imageHeight,
    },
    ...aiCaseStudies[project.slug].images,
  ];
}
