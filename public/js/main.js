// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active")
      })
    })
  }

  // Simulation Timeline Controls
  const timeSlider = document.getElementById("time-slider")
  const simulationMap = document.getElementById("simulation-map")
  const currentTimeDisplay = document.getElementById("current-time")
  const playBtn = document.getElementById("play-btn")
  const pauseBtn = document.getElementById("pause-btn")
  const resetBtn = document.getElementById("reset-btn")

  if (timeSlider && simulationMap) {
    const timeLabels = ["1 Hour", "2 Hours", "3 Hours", "6 Hours", "12 Hours", "24 Hours"]
    const mapImages = [
      "/placeholder.svg?height=500&width=800&text=1h",
      "/placeholder.svg?height=500&width=800&text=3h",
      "/placeholder.svg?height=500&width=800&text=6h",
      "/placeholder.svg?height=500&width=800&text=12h",
      "/placeholder.svg?height=500&width=800&text=24h",
    ]

    let isPlaying = false
    let playInterval

    timeSlider.addEventListener("input", function () {
      const timeIndex = Number.parseInt(this.value)
      updateSimulation(timeIndex)
    })

    function updateSimulation(timeIndex) {
      if (simulationMap && currentTimeDisplay) {
        simulationMap.src = mapImages[timeIndex]
        currentTimeDisplay.textContent = timeLabels[timeIndex]
      }
    }

    if (playBtn) {
      playBtn.addEventListener("click", () => {
        if (!isPlaying) {
          isPlaying = true
          playInterval = setInterval(() => {
            let currentValue = Number.parseInt(timeSlider.value)
            if (currentValue < 5) {
              currentValue++
              timeSlider.value = currentValue
              updateSimulation(currentValue)
            } else {
              // Reset to beginning
              timeSlider.value = 0
              updateSimulation(0)
            }
          }, 2000) // Change every 2 seconds
        }
      })
    }

    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        isPlaying = false
        clearInterval(playInterval)
      })
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        isPlaying = false
        clearInterval(playInterval)
        timeSlider.value = 0
        updateSimulation(0)
      })
    }
  }

  // Download Page Filters
  const mapTypeFilter = document.getElementById("map-type")
  const regionFilter = document.getElementById("region-filter")

  if (mapTypeFilter || regionFilter) {
    function filterMaps() {
      const mapCards = document.querySelectorAll(".map-card")
      const selectedType = mapTypeFilter ? mapTypeFilter.value : "all"
      const selectedRegion = regionFilter ? regionFilter.value : "all"

      mapCards.forEach((card) => {
        const cardType = card.querySelector(".map-type-badge").textContent.toLowerCase()
        const cardRegion = card.querySelector(".map-details").textContent.toLowerCase()

        let showCard = true

        if (selectedType !== "all" && !cardType.includes(selectedType)) {
          showCard = false
        }

        if (selectedRegion !== "all" && !cardRegion.includes(selectedRegion)) {
          showCard = false
        }

        card.style.display = showCard ? "block" : "none"
      })
    }

    if (mapTypeFilter) {
      mapTypeFilter.addEventListener("change", filterMaps)
    }

    if (regionFilter) {
      regionFilter.addEventListener("change", filterMaps)
    }
  }

  // Form Validation
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      const requiredFields = form.querySelectorAll("[required]")
      let isValid = true

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false
          field.style.borderColor = "#FF5A5F"
        } else {
          field.style.borderColor = "#DDDDDD"
        }
      })

      if (!isValid) {
        e.preventDefault()
        alert("Please fill in all required fields.")
      }
    })
  })

  // Set minimum date to today for date inputs
  const dateInputs = document.querySelectorAll('input[type="date"]')
  const today = new Date().toISOString().split("T")[0]
  dateInputs.forEach((input) => {
    input.min = today
  })

  // Fire Simulation Functionality
  const simulateBtn = document.getElementById("simulate-fire-btn")
  const simulationResults = document.getElementById("simulation-results")
  const mapContainer = document.getElementById("uttarakhand-map")

  let selectedIgnitionPoint = null
  const leafletMap = null

  // Initialize Leaflet Map (placeholder for now)
  function initializeMap() {
    // This is where you would initialize the actual Leaflet map
    // For now, we'll simulate map click functionality
    if (mapContainer) {
      mapContainer.addEventListener("click", (e) => {
        // Simulate selecting an ignition point
        const rect = mapContainer.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        selectedIgnitionPoint = { x, y }

        // Visual feedback for selected point
        const existingMarker = mapContainer.querySelector(".ignition-marker")
        if (existingMarker) {
          existingMarker.remove()
        }

        const marker = document.createElement("div")
        marker.className = "ignition-marker"
        marker.style.cssText = `
          position: absolute;
          left: ${x - 10}px;
          top: ${y - 10}px;
          width: 20px;
          height: 20px;
          background: #ff5a5f;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          z-index: 100;
          animation: pulse 2s infinite;
        `

        mapContainer.appendChild(marker)

        // Enable simulate button
        if (simulateBtn) {
          simulateBtn.disabled = false
          simulateBtn.textContent = "🔥 Simulate Fire Spread"
          simulateBtn.classList.remove("btn-disabled")
        }

        // Add pulse animation
        const style = document.createElement("style")
        style.textContent = `
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        `
        document.head.appendChild(style)
      })
    }
  }

  // Handle simulation button click
  if (simulateBtn) {
    simulateBtn.addEventListener("click", () => {
      if (!selectedIgnitionPoint) {
        alert("Please click on the map to select an ignition point first!")
        return
      }

      // Show loading state
      simulateBtn.disabled = true
      simulateBtn.textContent = "🔄 Simulating..."
      simulateBtn.classList.add("btn-disabled")

      // Simulate processing time
      setTimeout(() => {
        // Show results
        if (simulationResults) {
          simulationResults.style.display = "block"
          simulationResults.classList.add("fade-in")

          // Scroll to results
          simulationResults.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }

        // Reset button
        simulateBtn.disabled = false
        simulateBtn.textContent = "🔥 Simulate Fire Spread"
        simulateBtn.classList.remove("btn-disabled")

        // Update weather data (simulate real-time data)
        updateWeatherData()
      }, 2000) // 2 second simulation delay
    })
  }

  // Simulate weather data updates
  function updateWeatherData() {
    const weatherMetrics = document.querySelectorAll(".metric-value")
    if (weatherMetrics.length >= 4) {
      // Simulate slight variations in weather data
      const temp = 26 + Math.floor(Math.random() * 6) // 26-31°C
      const humidity = 40 + Math.floor(Math.random() * 20) // 40-60%
      const windSpeed = 8 + Math.floor(Math.random() * 10) // 8-18 km/h
      const directions = ["North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest"]
      const windDirection = directions[Math.floor(Math.random() * directions.length)]

      weatherMetrics[0].textContent = `${temp}°C`
      weatherMetrics[1].textContent = `${humidity}%`
      weatherMetrics[2].textContent = `${windSpeed} km/h`
      weatherMetrics[3].textContent = windDirection
    }
  }

  // Image hover effects for simulation results
  function addImageHoverEffects() {
    const resultImages = document.querySelectorAll(".simulation-result-image")
    resultImages.forEach((img) => {
      img.addEventListener("mouseenter", function () {
        this.style.cursor = "pointer"
      })

      img.addEventListener("click", function () {
        // Could open a modal or larger view
        console.log("Clicked on simulation result:", this.alt)
      })
    })
  }

  // Initialize everything
  initializeMap()

  // Add hover effects when results are shown
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.id === "simulation-results" && mutation.target.style.display !== "none") {
        setTimeout(addImageHoverEffects, 100)
      }
    })
  })

  if (simulationResults) {
    observer.observe(simulationResults, {
      attributes: true,
      attributeFilter: ["style"],
    })
  }

  // Handle "Run New Simulation" button
  document.addEventListener("click", (e) => {
    if (e.target.textContent.includes("Run New Simulation")) {
      // Reset the simulation
      if (simulationResults) {
        simulationResults.style.display = "none"
      }

      // Clear ignition point
      const marker = mapContainer?.querySelector(".ignition-marker")
      if (marker) {
        marker.remove()
      }

      selectedIgnitionPoint = null

      // Reset button state
      if (simulateBtn) {
        simulateBtn.disabled = true
        simulateBtn.textContent = "🔥 Simulate Fire Spread"
        simulateBtn.classList.add("btn-disabled")
      }

      // Scroll back to top
      mapContainer?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})
