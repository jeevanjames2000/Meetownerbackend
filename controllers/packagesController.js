const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multiparty = require("multiparty");
const fs = require("fs");
const path = require("path");

exports.getSellPackages = async (req, res) => {
  try {
    const packages = await prisma.packages.findMany({
      where: {
        is_active: "Yes",
        package_type: "sell",
      },
      orderBy: {
        id: "asc",
      },
    });

    const packagesData = [];
    if (packages.length > 0) {
      packages.forEach((package) => {
        packagesData.push({
          id: package.id,
          package_name: package.package_name,
          package_cost: package.package_cost,
          package_days: package.package_days,
          package_monhts: package.package_monhts,
          gst_included: package.gst_included,
          number_of_listings: package.number_of_listings,
          response_rate: package.response_rate,
          search_position: package.search_position,
          buyers_visibility: package.buyers_visibility,
          verified_tag: package.verified_tag,
          visibility_best_details: package.visibility_best_details,
          visibility_latest_details: package.visibility_latest_details,
          land_page_ad: package.land_page_ad,
          land_page_banner: package.land_page_banner,
          listings_page_ads: package.listings_page_ads,
          dedicated_agent_support: package.dedicated_agent_support,
          creatives: package.creatives,
          listing_support: package.listing_support,
          meta_ads: package.meta_ads,
          prime_promotion: package.prime_promotion,
          crm_support: package.crm_support,
          is_popular: package.is_popular,
        });
      });
    }

    await prisma.$disconnect();
    return res.status(200).json({
      status: "success",
      message: "Packages fetched successfully",
      packages: packagesData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getRentPackages = async (req, res) => {
  try {
    const packages = await prisma.packages.findMany({
      where: {
        is_active: "Yes",
        package_type: "rent",
      },
      orderBy: {
        id: "asc",
      },
    });

    const packagesData = [];
    if (packages.length > 0) {
      packages.forEach((package) => {
        packagesData.push({
          id: package.id,
          package_name: package.package_name,
          package_cost: package.package_cost,
          package_days: package.package_days,
          package_monhts: package.package_monhts,
          gst_included: package.gst_included,
          number_of_listings: package.number_of_listings,
          response_rate: package.response_rate,
          search_position: package.search_position,
          buyers_visibility: package.buyers_visibility,
          verified_tag: package.verified_tag,
          visibility_best_details: package.visibility_best_details,
          visibility_latest_details: package.visibility_latest_details,
          land_page_ad: package.land_page_ad,
          land_page_banner: package.land_page_banner,
          listings_page_ads: package.listings_page_ads,
          dedicated_agent_support: package.dedicated_agent_support,
          creatives: package.creatives,
          listing_support: package.listing_support,
          meta_ads: package.meta_ads,
          prime_promotion: package.prime_promotion,
          crm_support: package.crm_support,
          is_popular: package.is_popular,
        });
      });
    }

    await prisma.$disconnect();
    return res.status(200).json({
      status: "success",
      message: "Packages fetched successfully",
      packages: packagesData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getCommercialPackages = async (req, res) => {
  try {
    const packages = await prisma.packages.findMany({
      where: {
        is_active: "Yes",
        package_type: "commercial",
      },
      orderBy: {
        id: "asc",
      },
    });

    const packagesData = [];
    if (packages.length > 0) {
      packages.forEach((package) => {
        packagesData.push({
          id: package.id,
          package_name: package.package_name,
          package_cost: package.package_cost,
          package_days: package.package_days,
          package_monhts: package.package_monhts,
          gst_included: package.gst_included,
          number_of_listings: package.number_of_listings,
          response_rate: package.response_rate,
          search_position: package.search_position,
          buyers_visibility: package.buyers_visibility,
          verified_tag: package.verified_tag,
          visibility_best_details: package.visibility_best_details,
          visibility_latest_details: package.visibility_latest_details,
          land_page_ad: package.land_page_ad,
          land_page_banner: package.land_page_banner,
          listings_page_ads: package.listings_page_ads,
          dedicated_agent_support: package.dedicated_agent_support,
          creatives: package.creatives,
          listing_support: package.listing_support,
          meta_ads: package.meta_ads,
          prime_promotion: package.prime_promotion,
          crm_support: package.crm_support,
          is_popular: package.is_popular,
        });
      });
    }

    await prisma.$disconnect();
    return res.status(200).json({
      status: "success",
      message: "Packages fetched successfully",
      packages: packagesData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
exports.getAllSellPackages = async (req, res) => {
  try {
    const plans = [
      {
        title: "Free Listing",
        duration: "30 Days",
        price: "Free",
        features: {
          "Number Of Listings": "1",
          "Response Rate": "25",
          "Position On Search": "2X More",
          "Buyers Visibility": "Low",
          "Verified Tag": "Limited",
          "Visibility on Best Details": "No",
          "Visibility on Latest Details": "No",
          "Land Page AD": "No",
          "Land Page Banner": "No",
          "Listings Page Small ADS": "No",
          "Dedicated Agent Support": "No",
          Creatives: "No",
          "Listing Support": "No",
          "Meta ADS": "No",
          "Prime Promition": "No",
          CRM: "No",
        },
      },
      {
        title: "Basic",
        duration: "120 Days",
        price: 12999,
        features: {
          "Number Of Listings": "50",
          "Response Rate": "50",
          "Position On Search": "3X More",
          "Buyers Visibility": "50%",
          "Verified Tag": "Limited",
          "Visibility on Best Details": "No",
          "Visibility on Latest Details": "No",
          "Land Page AD": "No",
          "Land Page Banner": "No",
          "Listings Page Small ADS": "No",
          "Dedicated Agent Support": "No",
          Creatives: "No",
          "Listing Support": "No",
          "Meta ADS": "No",
          "Prime Promition": "No",
          CRM: "No",
        },
      },
      {
        title: "Prime",
        duration: "180 Days",
        price: 25999,
        isPopular: true,
        features: {
          "Number Of Listings": "150",
          "Response Rate": "150",
          "Position On Search": "5X More",
          "Buyers Visibility": "80%",
          "Verified Tag": "Unlimited",
          "Visibility on Best Details": "yes",
          "Visibility on Latest Details": "yes",
          "Land Page AD": "yes",
          "Land Page Banner": "yes",
          "Listings Page Small ADS": "yes",
          "Dedicated Agent Support": "yes",
          Creatives: "yes",
          "Listing Support": "yes",
          "Meta ADS": "No",
          "Prime Promition": "No",
          CRM: "No",
        },
      },
      {
        title: "Prime Plus",
        duration: "365 Days",
        price: 39000,
        features: {
          "Number Of Listings": "250",
          "Response Rate": "250",
          "Position On Search": "5X More",
          "Buyers Visibility": "100%",
          "Verified Tag": "Unlimited",
          "Visibility on Best Details": "yes",
          "Visibility on Latest Details": "yes",
          "Land Page AD": "yes",
          "Land Page Banner": "yes",
          "Listings Page Small ADS": "yes",
          "Dedicated Agent Support": "yes",
          Creatives: "yes",
          "Listing Support": "yes",
          "Meta ADS": "yes",
          "Prime Promition": "yes",
          CRM: "yes",
        },
      },
    ];

    res.status(200).json({
      success: true,
      message: "Packages retrieved successfully",
      data: plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving packages",
      error: error.message,
    });
  }
};
exports.getAllRentPackages = async (req, res) => {
  try {
    const plans = [
      {
        title: "Free Listing",
        duration: "30 Days",
        price: "Free",
        features: {
          "Number Of Listings": "1",
          "Response Rate": "25",
          "Position On Search": "2X More",
          "Buyers Visibility": "Low",
          "Verified Tag": "Limited",
          "Visibility on Best Details": "No",
          "Visibility on Latest Details": "No",
          "Land Page AD": "No",
          "Land Page Banner": "No",
          "Listings Page Small ADS": "No",
          "Dedicated Agent Support": "No",
          Creatives: "No",
          "Listing Support": "No",
          "Meta ADS": "No",
          "Prime Promition": "No",
          CRM: "No",
        },
      },
      {
        title: "Basic",
        duration: "120 Days",
        price: 10999,
        features: {
          "Number Of Listings": "50",
          "Response Rate": "50",
          "Position On Search": "3X More",
          "Buyers Visibility": "50%",
          "Verified Tag": "Limited",
          "Visibility on Best Details": "No",
          "Visibility on Latest Details": "No",
          "Land Page AD": "No",
          "Land Page Banner": "No",
          "Listings Page Small ADS": "No",
          "Dedicated Agent Support": "No",
          Creatives: "No",
          "Listing Support": "No",
          "Meta ADS": "No",
          "Prime Promition": "No",
          CRM: "No",
        },
      },
      {
        title: "Prime",
        duration: "180 Days",
        price: 20999,
        isPopular: true,
        features: {
          "Number Of Listings": "150",
          "Response Rate": "150",
          "Position On Search": "5X More",
          "Buyers Visibility": "80%",
          "Verified Tag": "Unlimited",
          "Visibility on Best Details": "yes",
          "Visibility on Latest Details": "yes",
          "Land Page AD": "yes",
          "Land Page Banner": "yes",
          "Listings Page Small ADS": "yes",
          "Dedicated Agent Support": "yes",
          Creatives: "yes",
          "Listing Support": "yes",
          "Meta ADS": "No",
          "Prime Promition": "No",
          CRM: "No",
        },
      },
      {
        title: "Prime Plus",
        duration: "365 Days",
        price: 35000,
        features: {
          "Number Of Listings": "250",
          "Response Rate": "250",
          "Position On Search": "5X More",
          "Buyers Visibility": "100%",
          "Verified Tag": "Unlimited",
          "Visibility on Best Details": "yes",
          "Visibility on Latest Details": "yes",
          "Land Page AD": "yes",
          "Land Page Banner": "yes",
          "Listings Page Small ADS": "yes",
          "Dedicated Agent Support": "yes",
          Creatives: "yes",
          "Listing Support": "yes",
          "Meta ADS": "yes",
          "Prime Promition": "yes",
          CRM: "yes",
        },
      },
    ];

    // Send response
    res.status(200).json({
      success: true,
      message: "Packages retrieved successfully",
      data: plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving packages",
      error: error.message,
    });
  }
};
exports.getAllCommercialsPackages = async (req, res) => {
  try {
    const plans = [
      {
        title: "Free Listing",
        duration: "30 Days",
        price: "Free",
        features: {
          "Number Of Listings": "1",
          "Response Rate": "25",
          "Position On Search": "2X More",
          "Buyers Visibility": "Low",
          "Verified Tag": "Limited",
          "Visibility on Best Details": "No",
          "Visibility on Latest Details": "No",
          "Land Page AD": "No",
          "Land Page Banner": "No",
          "Listings Page Small ADS": "No",
          "Dedicated Agent Support": "No",
          Creatives: "No",
          "Listing Support": "No",
          "Meta ADS": "No",
          "Prime Promition": "No",
          CRM: "No",
        },
      },
      {
        title: "Basic",
        duration: "120 Days",
        price: 9999,
        features: {
          "Number Of Listings": "50",
          "Response Rate": "50",
          "Position On Search": "3X More",
          "Buyers Visibility": "50%",
          "Verified Tag": "Limited",
          "Visibility on Best Details": "No",
          "Visibility on Latest Details": "No",
          "Land Page AD": "No",
          "Land Page Banner": "No",
          "Listings Page Small ADS": "No",
          "Dedicated Agent Support": "No",
          Creatives: "No",
          "Listing Support": "No",
          "Meta ADS": "No",
          "Prime Promition": "No",
          CRM: "No",
        },
      },
      {
        title: "Prime",
        duration: "180 Days",
        price: 15999,
        isPopular: true,
        features: {
          "Number Of Listings": "150",
          "Response Rate": "150",
          "Position On Search": "5X More",
          "Buyers Visibility": "80%",
          "Verified Tag": "Unlimited",
          "Visibility on Best Details": "yes",
          "Visibility on Latest Details": "yes",
          "Land Page AD": "yes",
          "Land Page Banner": "yes",
          "Listings Page Small ADS": "yes",
          "Dedicated Agent Support": "yes",
          Creatives: "yes",
          "Listing Support": "yes",
          "Meta ADS": "No",
          "Prime Promition": "No",
          CRM: "No",
        },
      },
      {
        title: "Prime Plus",
        duration: "365 Days",
        price: 29000,
        features: {
          "Number Of Listings": "250",
          "Response Rate": "250",
          "Position On Search": "5X More",
          "Buyers Visibility": "100%",
          "Verified Tag": "Unlimited",
          "Visibility on Best Details": "yes",
          "Visibility on Latest Details": "yes",
          "Land Page AD": "yes",
          "Land Page Banner": "yes",
          "Listings Page Small ADS": "yes",
          "Dedicated Agent Support": "yes",
          Creatives: "yes",
          "Listing Support": "yes",
          "Meta ADS": "yes",
          "Prime Promition": "yes",
          CRM: "yes",
        },
      },
    ];

    // Send response
    res.status(200).json({
      success: true,
      message: "Packages retrieved successfully",
      data: plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving packages",
      error: error.message,
    });
  }
};
