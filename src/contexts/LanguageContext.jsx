import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import { languages } from "src/config/languages";
import Loading from "src/components/Loading/Loading";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState("en");

  const [translations, setTranslations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTranslations = useCallback(async (lang) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/locales/${lang}/common.json`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setTranslations(data);
    } catch (err) {
      setError(err.message);
      console.error(`Failed to load translations for ${lang}:`, err);
      if (lang !== "en") {
        console.log("Falling back to English translations");
        fetchTranslations("en");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTranslations(locale);
  }, [locale, fetchTranslations]);

  const memoizedLanguageData = useMemo(() => languages[locale], [locale]);

  const changeLanguage = useCallback(
    async (lang) => {
      if (!(lang in languages)) {
        console.error(`Language ${lang} is not supported`);
        return;
      }

      setLocale(lang);
      document.documentElement.dir = languages[lang].dir || "ltr";
      await fetchTranslations(lang);
    },
    [fetchTranslations]
  );

  const getNestedValue = useCallback((obj, path) => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }, []);

  const t = useCallback(
    (key, params) => {
      if (!translations) return key;

      let text = getNestedValue(translations, key);
      if (text === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }

      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          text = text.replace(new RegExp(`{{${param}}}`, "g"), String(value));
        });
      }

      return text;
    },
    [translations, getNestedValue]
  );

  const getSection = useCallback(
    (section) => {
      if (!translations) return {};
      return translations[section] || {};
    },
    [translations]
  );

  const contextValue = useMemo(
    () => ({
      locale,
      translations,
      changeLanguage,
      isLoading,
      error,
      languageData: memoizedLanguageData,
      t,
      getSection,
    }),
    [
      locale,
      translations,
      changeLanguage,
      isLoading,
      error,
      memoizedLanguageData,
      t,
      getSection,
    ]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {contextValue.isLoading ? <Loading /> : children}
    </LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const useTranslationSection = (section) => {
  const { getSection } = useLanguage();
  return useMemo(() => getSection(section), [getSection, section]);
};
