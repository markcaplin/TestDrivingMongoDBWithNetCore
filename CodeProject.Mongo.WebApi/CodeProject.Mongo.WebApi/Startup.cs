using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CodeProject.Mongo.Business.Service;
using CodeProject.Mongo.Data.MongoDb;
using CodeProject.Mongo.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CodeProject.Mongo.WebApi
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			CorsPolicyBuilder corsBuilder = new CorsPolicyBuilder();

			corsBuilder.AllowAnyHeader();
			corsBuilder.AllowAnyMethod();
			corsBuilder.AllowAnyOrigin();
			corsBuilder.AllowCredentials();

			services.AddCors(options =>
			{
				options.AddPolicy("SiteCorsPolicy", corsBuilder.Build());
			});

			services.AddTransient<IOnlineStoreDataService, OnlineStoreDataService>();

			services.AddTransient<IOnlineStoreBusinessService>(provider =>
			new OnlineStoreBusinessService(provider.GetRequiredService<IOnlineStoreDataService>()));

			services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			app.Use(async (ctx, next) =>
			{
				await next();
				if (ctx.Response.StatusCode == 204)
				{
					ctx.Response.ContentLength = 0;
				}
			});

			app.UseCors("SiteCorsPolicy");

			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}

			app.UseMvc();
		}
	}
}
